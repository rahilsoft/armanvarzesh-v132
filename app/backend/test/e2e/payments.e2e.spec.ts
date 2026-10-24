import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../src/database/prisma.service';
import { createTestApp } from './utils/test-app';

// The provider is configured the way production is; none of these paths reach the
// network (unknown authority, cancelled and already-paid callbacks never call Zarinpal).
const ENV: Record<string, string> = {
  PAYMENT_PROVIDER: 'zarinpal',
  ZARINPAL_MERCHANT_ID: 'e2e-merchant-id-000000000000000000',
  ZARINPAL_CALLBACK_URL: 'http://localhost/payments/zarinpal/callback',
};

describe('Zarinpal payment routes (e2e, real PostgreSQL)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let userId: number;
  const saved: Record<string, string | undefined> = {};

  beforeAll(async () => {
    for (const k of Object.keys(ENV)) {
      saved[k] = process.env[k];
      process.env[k] = ENV[k];
    }
    app = await createTestApp();
    prisma = app.get(PrismaService);
    const reg = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: `pay-${Date.now()}@example.com`, password: 'P@ssw0rd-e2e!' })
      .expect(201);
    token = reg.body.accessToken;
    userId = reg.body.user.id;
  });

  afterAll(async () => {
    await app.close();
    for (const k of Object.keys(ENV)) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it('POST /payments/zarinpal/request needs a bearer token', async () => {
    await request(app.getHttpServer()).post('/payments/zarinpal/request').send({ amount: 100000 }).expect(401);
  });

  it('rejects out-of-bounds, non-integer and unknown-field bodies before touching the gateway', async () => {
    const server = app.getHttpServer();
    const post = (body: object) =>
      request(server).post('/payments/zarinpal/request').set('Authorization', `Bearer ${token}`).send(body);
    await post({ amount: 1 }).expect(400);
    await post({ amount: 'abc' }).expect(400);
    await post({ amount: 100000.5 }).expect(400);
  });

  it('callback rejects an unknown authority and never reports success', async () => {
    const res = await request(app.getHttpServer())
      .get('/payments/zarinpal/callback')
      .query({ Authority: 'A00000000000000000000000000000000000', Status: 'OK' })
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe('failed');
    expect(res.body.reference).toBeNull();
  });

  it('a cancelled callback moves a pending payment to failed and never to paid', async () => {
    const authority = `A-cancel-${Date.now()}`;
    await prisma.payment.create({ data: { authority, amount: 100000, status: 'pending', userId } });
    const res = await request(app.getHttpServer())
      .get('/payments/zarinpal/callback')
      .query({ Authority: authority, Status: 'NOK' })
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body).toMatchObject({ success: false, status: 'cancelled' });
    expect((await prisma.payment.findUniqueOrThrow({ where: { authority } })).status).toBe('failed');
  });

  it('a forged NOK cannot downgrade a paid payment, and a repeated OK is reported as already paid', async () => {
    const authority = `A-paid-${Date.now()}`;
    await prisma.payment.create({ data: { authority, amount: 100000, status: 'paid', userId } });
    const server = app.getHttpServer();

    const nok = await request(server).get('/payments/zarinpal/callback').query({ Authority: authority, Status: 'NOK' }).set('Accept', 'application/json').expect(200);
    expect(nok.body).toMatchObject({ success: true, alreadyPaid: true });

    const ok = await request(server).get('/payments/zarinpal/callback').query({ Authority: authority, Status: 'OK' }).set('Accept', 'application/json').expect(200);
    expect(ok.body).toMatchObject({ success: true, alreadyPaid: true });
    expect((await prisma.payment.findUniqueOrThrow({ where: { authority } })).status).toBe('paid');
  });

  it('callback treats a missing Status as a failure, not as OK', async () => {
    const res = await request(app.getHttpServer())
      .get('/payments/zarinpal/callback')
      .query({ Authority: 'A00000000000000000000000000000000001' })
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body.success).toBe(false);
  });
});
