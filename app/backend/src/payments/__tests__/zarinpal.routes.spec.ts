import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';
import { ZarinpalPaymentsController } from '../zarinpal.controller';
import { PaymentsService } from '../payments.service';
import { PaymentsResolver } from '../payments.resolver';
import { StoredPayment, assertPaymentProviderConfigured } from '../providers/payment.provider';
import { ZarinpalService } from '../../service/zarinpal.service';

const SECRET = 'route-test-secret-route-test-secret-32';

function token(sub: string | number): string {
  return jwt.sign({ sub: String(sub), role: 'user' }, SECRET, { algorithm: 'HS256', expiresIn: '5m' });
}

/** In-memory "Payment" table driven by the SQL PrismaPaymentStore emits. */
class FakeDb {
  rows = new Map<string, StoredPayment & { userId?: number | null }>();
  async query(sql: any): Promise<any> {
    const r = this.rows.get(sql.values[0]);
    return r ? [{ ...r }] : [];
  }
  async exec(sql: any): Promise<number> {
    const text: string = sql.strings.join('?');
    if (text.includes('INSERT INTO "Payment"')) {
      const [authority, amount, status, userId] = sql.values;
      if (!this.rows.has(authority)) this.rows.set(authority, { authority, amount, status, userId });
      return 1;
    }
    const [status, authority, amount] = sql.values;
    const r = this.rows.get(authority);
    if (!r || r.amount !== amount || r.status === status) return 0;
    r.status = status;
    return 1;
  }
}

describe('Zarinpal payment routes', () => {
  const ENV = { ...process.env };
  let app: INestApplication;
  let db: FakeDb;

  beforeEach(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = SECRET;
    process.env.ZARINPAL_MERCHANT_ID = 'merchant-1';
    process.env.ZARINPAL_CALLBACK_URL = 'https://api.armanvarzesh.ir/payments/zarinpal/callback';
    delete process.env.PAYMENT_PROVIDER;
    db = new FakeDb();
    const moduleRef = await Test.createTestingModule({
      controllers: [ZarinpalPaymentsController],
      providers: [{ provide: PaymentsService, useValue: new PaymentsService(db as any) }],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    process.env = { ...ENV };
    jest.restoreAllMocks();
  });

  describe('POST /payments/zarinpal/request', () => {
    it('returns 401 without a JWT and never reaches the gateway', async () => {
      const spy = jest.spyOn(ZarinpalService.prototype, 'requestPayment');
      const res = await request(app.getHttpServer()).post('/payments/zarinpal/request').send({ amount: 50000 });
      expect(res.status).toBe(401);
      expect(spy).not.toHaveBeenCalled();
      expect(db.rows.size).toBe(0);
    });

    it('returns 401 for a forged token and ignores x-user-id headers', async () => {
      const spy = jest.spyOn(ZarinpalService.prototype, 'requestPayment');
      const forged = jwt.sign({ sub: '1' }, 'not-the-server-secret-not-the-server-secret');
      const res = await request(app.getHttpServer())
        .post('/payments/zarinpal/request')
        .set('Authorization', `Bearer ${forged}`)
        .set('x-user-id', '1')
        .send({ amount: 50000 });
      expect(res.status).toBe(401);
      expect(spy).not.toHaveBeenCalled();
    });

    it('takes userId only from the JWT and persists the pending row', async () => {
      jest
        .spyOn(ZarinpalService.prototype, 'requestPayment')
        .mockResolvedValue({ Status: 100, Authority: 'AUTH-42', paymentUrl: 'https://payment.zarinpal.com/pg/StartPay/AUTH-42' });
      const res = await request(app.getHttpServer())
        .post('/payments/zarinpal/request')
        .set('Authorization', `Bearer ${token(42)}`)
        .set('x-user-id', '7')
        .send({ amount: 50000, description: 'VIP' });
      expect(res.status).toBe(201);
      expect(res.body.data).toEqual({ authority: 'AUTH-42', redirectUrl: 'https://payment.zarinpal.com/pg/StartPay/AUTH-42' });
      expect(db.rows.get('AUTH-42')).toEqual({ authority: 'AUTH-42', amount: 50000, status: 'pending', userId: 42 });
      expect(ZarinpalService.prototype.requestPayment).toHaveBeenCalledWith(50000, 'VIP', process.env.ZARINPAL_CALLBACK_URL);
    });

    it('rejects a userId or callbackUrl in the body', async () => {
      const spy = jest.spyOn(ZarinpalService.prototype, 'requestPayment');
      const auth = { Authorization: `Bearer ${token(42)}` };
      const r1 = await request(app.getHttpServer()).post('/payments/zarinpal/request').set(auth).send({ amount: 50000, userId: 7 });
      const r2 = await request(app.getHttpServer())
        .post('/payments/zarinpal/request')
        .set(auth)
        .send({ amount: 50000, callbackUrl: 'https://evil.example' });
      expect(r1.status).toBe(400);
      expect(r2.status).toBe(400);
      expect(spy).not.toHaveBeenCalled();
    });

    it('fails fast with a clear error when ZARINPAL_CALLBACK_URL is missing', async () => {
      delete process.env.ZARINPAL_CALLBACK_URL;
      const spy = jest.spyOn(ZarinpalService.prototype, 'requestPayment');
      const res = await request(app.getHttpServer())
        .post('/payments/zarinpal/request')
        .set('Authorization', `Bearer ${token(42)}`)
        .send({ amount: 50000 });
      expect(res.status).toBe(503);
      expect(res.body.message).toMatch(/ZARINPAL_CALLBACK_URL/);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('GET /payments/zarinpal/callback', () => {
    it('verifies with the stored amount and is idempotent', async () => {
      db.rows.set('AUTH-1', { authority: 'AUTH-1', amount: 70000, status: 'pending', userId: 42 });
      const verify = jest.spyOn(ZarinpalService.prototype, 'verifyPayment').mockResolvedValue({ Status: 100, RefID: 'R-9' });
      const r1 = await request(app.getHttpServer()).get('/payments/zarinpal/callback').query({ Authority: 'AUTH-1', Status: 'OK' });
      expect(r1.status).toBe(200);
      expect(r1.body).toMatchObject({ success: true, reference: 'R-9', alreadyPaid: false });
      expect(verify).toHaveBeenCalledWith('AUTH-1', 70000);
      expect(db.rows.get('AUTH-1')?.status).toBe('paid');

      const r2 = await request(app.getHttpServer()).get('/payments/zarinpal/callback').query({ Authority: 'AUTH-1', Status: 'OK' });
      expect(r2.body).toMatchObject({ success: true, alreadyPaid: true });
      expect(verify).toHaveBeenCalledTimes(1);
    });

    it('rejects a missing Status without calling the gateway', async () => {
      db.rows.set('AUTH-2', { authority: 'AUTH-2', amount: 1000, status: 'pending' });
      const verify = jest.spyOn(ZarinpalService.prototype, 'verifyPayment');
      const res = await request(app.getHttpServer()).get('/payments/zarinpal/callback').query({ Authority: 'AUTH-2' });
      expect(res.body).toMatchObject({ success: false, reason: 'invalid_callback' });
      expect(verify).not.toHaveBeenCalled();
      expect(db.rows.get('AUTH-2')?.status).toBe('pending');
    });

    it('rejects an unknown authority', async () => {
      const verify = jest.spyOn(ZarinpalService.prototype, 'verifyPayment');
      const res = await request(app.getHttpServer()).get('/payments/zarinpal/callback').query({ Authority: 'NOPE', Status: 'OK' });
      expect(res.body).toMatchObject({ success: false, reason: 'unknown_authority' });
      expect(verify).not.toHaveBeenCalled();
    });
  });
});

describe('PaymentsService.verify status is required', () => {
  const ENV = { ...process.env };
  afterEach(() => {
    process.env = { ...ENV };
    jest.restoreAllMocks();
  });

  it('rejects a missing or empty status without reading the store or calling the gateway', async () => {
    process.env.ZARINPAL_MERCHANT_ID = 'merchant-1';
    const db = { query: jest.fn(), exec: jest.fn() };
    const verify = jest.spyOn(ZarinpalService.prototype, 'verifyPayment');
    const svc = new PaymentsService(db as any);
    expect(await svc.verify('A1', undefined, '')).toBe(false);
    expect(await svc.verify('A1', undefined, undefined as unknown as string)).toBe(false);
    expect(db.query).not.toHaveBeenCalled();
    expect(verify).not.toHaveBeenCalled();
  });

  it('the GraphQL resolver forwards the required status (no OK default)', async () => {
    const svc = { verifyPayment: jest.fn().mockResolvedValue({ ok: false }) } as any;
    const resolver = new PaymentsResolver(svc);
    expect(await resolver.verifyPayment('A1', 'NOK')).toBe(false);
    expect(svc.verifyPayment).toHaveBeenCalledWith('A1', undefined, 'NOK');
  });
});

describe('payment provider in production', () => {
  const ENV = { ...process.env };
  afterEach(() => {
    process.env = { ...ENV };
  });

  it.each([
    ['production', undefined],
    ['production', 'mock'],
    ['staging', undefined],
    ['staging', 'mock'],
    [undefined, undefined],
  ])('NODE_ENV=%s PAYMENT_PROVIDER=%s fails fast at module init', (nodeEnv, provider) => {
    if (nodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = nodeEnv;
    if (provider === undefined) delete process.env.PAYMENT_PROVIDER;
    else process.env.PAYMENT_PROVIDER = provider;
    process.env.ZARINPAL_MERCHANT_ID = 'merchant-1';
    const svc = new PaymentsService({} as any);
    expect(() => svc.onModuleInit()).toThrow(/PAYMENT_PROVIDER/);
  });

  it('production with zarinpal but no merchant id fails fast', () => {
    process.env.NODE_ENV = 'production';
    process.env.PAYMENT_PROVIDER = 'zarinpal';
    delete process.env.ZARINPAL_MERCHANT_ID;
    expect(() => new PaymentsService({} as any).onModuleInit()).toThrow(/ZARINPAL_MERCHANT_ID/);
  });

  it('production with zarinpal and merchant id boots', () => {
    process.env.NODE_ENV = 'production';
    process.env.PAYMENT_PROVIDER = 'zarinpal';
    process.env.ZARINPAL_MERCHANT_ID = 'merchant-1';
    expect(() => new PaymentsService({} as any).onModuleInit()).not.toThrow();
    expect(assertPaymentProviderConfigured()).toBe('zarinpal');
  });

  it('first use in production with a mock provider throws before any gateway or DB call', async () => {
    process.env.NODE_ENV = 'production';
    process.env.PAYMENT_PROVIDER = 'mock';
    process.env.ZARINPAL_MERCHANT_ID = 'merchant-1';
    const db = { query: jest.fn(), exec: jest.fn() };
    const svc = new PaymentsService(db as any);
    await expect(svc.verify('A1', undefined, 'OK')).rejects.toThrow(/PAYMENT_PROVIDER=mock is forbidden/);
    await expect(svc.requestPayment({ amount: 1000, callbackUrl: 'https://cb', userId: 1 })).rejects.toThrow(/PAYMENT_PROVIDER=mock/);
    expect(db.query).not.toHaveBeenCalled();
    expect(db.exec).not.toHaveBeenCalled();
  });
});
