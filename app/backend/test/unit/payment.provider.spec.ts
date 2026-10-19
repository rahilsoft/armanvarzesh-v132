import { makePaymentProvider } from '../../src/payments/providers/payment.provider';
import { ZarinpalService } from '../../src/service/zarinpal.service';

const ENV = { ...process.env };
const mockFetch = (json: any, ok = true) =>
  ((global as any).fetch = jest.fn().mockResolvedValue({ ok, json: async () => json }));

beforeEach(() => {
  process.env = { ...ENV };
  delete process.env.PAYMENT_PROVIDER;
  delete process.env.ZARINPAL_MERCHANT_ID;
  delete process.env.ZARINPAL_SANDBOX;
});
afterAll(() => {
  process.env = ENV;
});

describe('makePaymentProvider', () => {
  it('refuses unset provider in production', () => {
    (process.env as any).NODE_ENV = 'production';
    expect(() => makePaymentProvider()).toThrow(/PAYMENT_PROVIDER.*ZARINPAL_MERCHANT_ID/);
  });
  it('refuses mock in production', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.PAYMENT_PROVIDER = 'mock';
    expect(() => makePaymentProvider()).toThrow(/PAYMENT_PROVIDER=mock/);
  });
  it('refuses unset provider when NODE_ENV is not explicit', () => {
    delete (process.env as any).NODE_ENV;
    expect(() => makePaymentProvider()).toThrow(/PAYMENT_PROVIDER/);
  });
  it('allows mock in test and mock verify rejects missing status', async () => {
    (process.env as any).NODE_ENV = 'test';
    process.env.PAYMENT_PROVIDER = 'mock';
    const p = makePaymentProvider();
    expect((await p.verifyCallback({})).ok).toBe(false);
    expect((await p.verifyCallback({ status: 'OK', authority: 'A' })).ok).toBe(true);
  });
  it('zarinpal without merchant id throws', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.PAYMENT_PROVIDER = 'zarinpal';
    expect(() => makePaymentProvider()).toThrow(/ZARINPAL_MERCHANT_ID/);
  });
  it('unknown provider throws', () => {
    (process.env as any).NODE_ENV = 'test';
    process.env.PAYMENT_PROVIDER = 'nope';
    expect(() => makePaymentProvider()).toThrow(/Unknown PAYMENT_PROVIDER/);
  });
  it('zarinpal provider has no fake fallback on error', async () => {
    (process.env as any).NODE_ENV = 'development';
    process.env.PAYMENT_PROVIDER = 'zarinpal';
    process.env.ZARINPAL_MERCHANT_ID = 'm-1';
    const p = makePaymentProvider();
    (global as any).fetch = jest.fn().mockRejectedValue(new Error('boom'));
    await expect(p.createPayment({ amount: 1000, callbackUrl: 'https://x/cb' })).rejects.toThrow(/Zarinpal request failed/);
  });
  it('zarinpal verify never succeeds on missing status or failed gateway', async () => {
    (process.env as any).NODE_ENV = 'development';
    process.env.PAYMENT_PROVIDER = 'zarinpal';
    process.env.ZARINPAL_MERCHANT_ID = 'm-1';
    const p = makePaymentProvider();
    (global as any).fetch = jest.fn();
    expect((await p.verifyCallback({ authority: 'A', amount: 1000 })).ok).toBe(false);
    expect((global as any).fetch).not.toHaveBeenCalled();
    mockFetch({ data: [], errors: { code: -51 } });
    expect((await p.verifyCallback({ status: 'OK', authority: 'A', amount: 1000 })).ok).toBe(false);
  });
});

describe('ZarinpalService', () => {
  beforeEach(() => {
    process.env.ZARINPAL_MERCHANT_ID = 'm-1';
    process.env.ZARINPAL_CALLBACK_URL = 'https://x/cb';
  });

  it('throws without merchant id', async () => {
    delete process.env.ZARINPAL_MERCHANT_ID;
    await expect(new ZarinpalService().requestPayment(1000, 'd')).rejects.toThrow(/ZARINPAL_MERCHANT_ID/);
    await expect(new ZarinpalService().verifyPayment('A', 1000)).rejects.toThrow(/ZARINPAL_MERCHANT_ID/);
  });
  it('request success on code 100 against real host', async () => {
    mockFetch({ data: { code: 100, authority: 'A123' }, errors: [] });
    const r = await new ZarinpalService().requestPayment(1000, 'd');
    expect(r).toMatchObject({ Status: 100, Authority: 'A123', paymentUrl: 'https://payment.zarinpal.com/pg/StartPay/A123' });
    const [url, init] = (global as any).fetch.mock.calls[0];
    expect(url).toBe('https://payment.zarinpal.com/pg/v4/payment/request.json');
    expect(JSON.parse(init.body)).toMatchObject({ merchant_id: 'm-1', amount: 1000, callback_url: 'https://x/cb' });
  });
  it('uses sandbox host when ZARINPAL_SANDBOX=true', async () => {
    process.env.ZARINPAL_SANDBOX = 'true';
    mockFetch({ data: { code: 100, authority: 'S1' }, errors: [] });
    const r = await new ZarinpalService().requestPayment(1000, 'd');
    expect(r.paymentUrl).toBe('https://sandbox.zarinpal.com/pg/StartPay/S1');
    expect((global as any).fetch.mock.calls[0][0]).toContain('sandbox.zarinpal.com');
  });
  it('request fails on non-100 code', async () => {
    mockFetch({ data: [], errors: { code: -9 } }, false);
    await expect(new ZarinpalService().requestPayment(1000, 'd')).rejects.toThrow(/code -9/);
  });
  it('request fails on network error', async () => {
    (global as any).fetch = jest.fn().mockRejectedValue(new Error('down'));
    await expect(new ZarinpalService().requestPayment(1000, 'd')).rejects.toThrow(/down/);
  });
  it('verify succeeds on 100 and 101', async () => {
    for (const code of [100, 101]) {
      mockFetch({ data: { code, ref_id: 777 }, errors: [] });
      const r = await new ZarinpalService().verifyPayment('A', 1000);
      expect(r).toMatchObject({ Status: 100, RefID: 777 });
      expect((global as any).fetch.mock.calls[0][0]).toBe('https://payment.zarinpal.com/pg/v4/payment/verify.json');
    }
  });
  it('verify fails on other codes', async () => {
    mockFetch({ data: [], errors: { code: -50 } });
    await expect(new ZarinpalService().verifyPayment('A', 1000)).rejects.toThrow(/code -50/);
  });
});
