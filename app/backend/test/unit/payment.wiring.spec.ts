import { CircuitBreaker } from '../../src/common/retry/circuitBreaker';
import { guardedGatewayCall, PrismaPaymentStore, StoredPayment, ZarinpalPaymentProvider } from '../../src/payments/providers/payment.provider';
import { PaymentsController } from '../../src/payments/controllers/payments.controller';
import { PaymentsService } from '../../src/payments/payments.service';
import { ZarinpalGatewayError, ZarinpalService } from '../../src/service/zarinpal.service';

/** In-memory "Payment" table driven by the SQL PrismaPaymentStore emits. */
class FakeDb {
  rows = new Map<string, StoredPayment>();
  async query(sql: any): Promise<any> {
    const r = this.rows.get(sql.values[0]);
    return r ? [{ ...r }] : [];
  }
  async exec(sql: any): Promise<number> {
    const text: string = sql.strings.join('?');
    if (text.includes('INSERT INTO "Payment"')) {
      const [authority, amount, status] = sql.values;
      if (!this.rows.has(authority)) this.rows.set(authority, { authority, amount, status });
      return 1;
    }
    const [status, authority, amount] = sql.values;
    const r = this.rows.get(authority);
    if (!r || r.amount !== amount || r.status === status) return 0;
    r.status = status;
    return 1;
  }
}

describe('payments wiring', () => {
  const env = { ...process.env };
  beforeEach(() => {
    process.env.ZARINPAL_MERCHANT_ID = 'mid';
  });
  afterEach(() => {
    process.env = { ...env };
    jest.restoreAllMocks();
  });

  it('controller passes undefined amount and real Status when Amount is absent', async () => {
    const svc = { verify: jest.fn().mockResolvedValue(true) } as any;
    const ctrl = new PaymentsController(svc);
    await ctrl.verifyCallback('A1', 'NOK');
    expect(svc.verify).toHaveBeenCalledWith('A1', undefined, 'NOK');
    await ctrl.verifyCallback('A1', undefined as any);
    expect(svc.verify).toHaveBeenLastCalledWith('A1', undefined, '');
    expect(svc.verify).toHaveBeenCalledWith('A1', undefined, 'NOK');
    await ctrl.verifyCallback('A1', 'OK', '500');
    expect(svc.verify).toHaveBeenLastCalledWith('A1', 500, 'OK');
  });

  it('requestPayment persists pending row into "Payment" and verify settles it end to end', async () => {
    const db = new FakeDb();
    jest.spyOn(ZarinpalService.prototype, 'requestPayment').mockResolvedValue({ Status: 100, Authority: 'AUTH1', paymentUrl: 'https://x/AUTH1' });
    const verifySpy = jest.spyOn(ZarinpalService.prototype, 'verifyPayment').mockResolvedValue({ Status: 100, RefID: 9 });
    const svc = new PaymentsService(db as any);
    const out = await svc.requestPayment({ amount: 1000, callbackUrl: 'https://cb', userId: 7 });
    expect(out).toEqual({ authority: 'AUTH1', redirectUrl: 'https://x/AUTH1' });
    expect(db.rows.get('AUTH1')).toEqual({ authority: 'AUTH1', amount: 1000, status: 'pending' });
    expect(await svc.verify('AUTH1', undefined, 'OK')).toBe(true);
    expect(verifySpy).toHaveBeenCalledWith('AUTH1', 1000);
    expect(db.rows.get('AUTH1')?.status).toBe('paid');
  });

  it('verify rejects non-OK Status without calling gateway', async () => {
    const db = new FakeDb();
    db.rows.set('A2', { authority: 'A2', amount: 10, status: 'pending' });
    const spy = jest.spyOn(ZarinpalService.prototype, 'verifyPayment');
    expect(await new PaymentsService(db as any).verify('A2', undefined, 'NOK')).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it('createPending uses parameterized SQL', async () => {
    const exec = jest.fn().mockResolvedValue(1);
    await new PrismaPaymentStore({ query: jest.fn(), exec } as any).createPending({ authority: "x'; DROP", amount: 5 });
    expect(exec.mock.calls[0][0].values).toEqual(["x'; DROP", 5, 'pending', null]);
  });

  it('business rejection is not retried and does not trip breaker', async () => {
    const breaker = new CircuitBreaker(2, 60000);
    const fn = jest.fn().mockRejectedValue(new ZarinpalGatewayError('code -51', false, '-51'));
    for (let i = 0; i < 3; i++) await expect(guardedGatewayCall(breaker, fn)).rejects.toThrow('-51');
    expect(fn).toHaveBeenCalledTimes(3);
    expect(breaker.getState()).toBe('CLOSED');
  });

  it('transport failure is retried and counted', async () => {
    const breaker = new CircuitBreaker(1, 60000);
    jest.spyOn(global, 'setTimeout').mockImplementation(((cb: any) => {
      cb();
      return 0 as any;
    }) as any);
    const fn = jest.fn().mockRejectedValue(new ZarinpalGatewayError('HTTP 502', true));
    await expect(guardedGatewayCall(breaker, fn)).rejects.toThrow('502');
    expect(fn).toHaveBeenCalledTimes(4);
    expect(breaker.getState()).toBe('OPEN');
  });

  it('provider verify with -51 reports gateway_rejected and keeps breaker closed', async () => {
    const db = new FakeDb();
    db.rows.set('A3', { authority: 'A3', amount: 10, status: 'pending' });
    const client = { requestPayment: jest.fn(), verifyPayment: jest.fn().mockRejectedValue(new ZarinpalGatewayError('code -51', false, '-51')) };
    const p = new ZarinpalPaymentProvider('mid', new PrismaPaymentStore(db as any), client);
    for (let i = 0; i < 6; i++) expect((await p.verifyCallback({ Status: 'OK', Authority: 'A3' })).reason).toBe('gateway_rejected');
    expect(client.verifyPayment).toHaveBeenCalledTimes(6);
    expect(p.getBreakerState()).toBe('CLOSED');
  });
});

describe('zarinpal post()', () => {
  const env = { ...process.env };
  const realFetch = global.fetch;
  beforeEach(() => {
    process.env.ZARINPAL_MERCHANT_ID = 'mid';
  });
  afterEach(() => {
    process.env = { ...env };
    global.fetch = realFetch;
  });

  it('5xx is a retryable gateway error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503, json: async () => null }) as any;
    await expect(new ZarinpalService().verifyPayment('A', 1)).rejects.toMatchObject({ retryable: true });
  });

  it('4xx with business code is not retryable', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({ errors: { code: -51 } }) }) as any;
    await expect(new ZarinpalService().verifyPayment('A', 1)).rejects.toMatchObject({ retryable: false, code: '-51' });
  });

  it('200 with business code is not retryable', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ data: { code: -9 } }) }) as any;
    await expect(new ZarinpalService().verifyPayment('A', 1)).rejects.toMatchObject({ retryable: false });
  });

  it('aborts after ZARINPAL_TIMEOUT_MS', async () => {
    process.env.ZARINPAL_TIMEOUT_MS = '20';
    global.fetch = jest.fn(
      (_u: any, init: any) =>
        new Promise((_r, rej) => {
          init.signal.addEventListener('abort', () => rej(Object.assign(new Error('aborted'), { name: 'AbortError' })));
        }),
    ) as any;
    await expect(new ZarinpalService().verifyPayment('A', 1)).rejects.toMatchObject({ retryable: true, message: expect.stringContaining('timeout') });
    expect((global.fetch as jest.Mock).mock.calls[0][1].signal).toBeDefined();
  });
});
