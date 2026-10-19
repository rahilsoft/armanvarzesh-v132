import { withBackoff, CircuitBreaker } from '../../common/retry/circuitBreaker';
import { ZarinpalService, requireMerchantId } from '../../service/zarinpal.service';

export interface PaymentCreateInput {
  amount: number;
  currency?: string;
  referenceId?: string;
  callbackUrl: string;
  meta?: Record<string, any>;
}
export interface PaymentCreateResult {
  redirectUrl?: string;
  authority?: string;
  gatewayRef?: string;
}
export interface PaymentVerification {
  ok: boolean;
  reference?: string;
  raw?: any;
}

export interface PaymentProvider {
  createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult>;
  verifyCallback(payload: any): Promise<PaymentVerification>;
}

export function makePaymentProvider(): PaymentProvider {
  const env = process.env.NODE_ENV;
  const raw = (process.env.PAYMENT_PROVIDER || '').trim().toLowerCase();
  const mockAllowed = env === 'test' || env === 'development';
  if (!raw) {
    if (!mockAllowed) {
      throw new Error('PAYMENT_PROVIDER is not set. Set PAYMENT_PROVIDER=zarinpal and ZARINPAL_MERCHANT_ID (the mock provider is only allowed when NODE_ENV is test or development).');
    }
    return new MockPaymentProvider();
  }
  switch (raw) {
    case 'zarinpal':
      return new ZarinpalPaymentProvider(requireMerchantId());
    case 'mock':
      if (!mockAllowed) {
        throw new Error('PAYMENT_PROVIDER=mock is forbidden unless NODE_ENV is test or development. Use PAYMENT_PROVIDER=zarinpal with ZARINPAL_MERCHANT_ID.');
      }
      return new MockPaymentProvider();
    default:
      throw new Error(`Unknown PAYMENT_PROVIDER "${raw}". Supported: zarinpal (and mock in test/development). ZARINPAL_MERCHANT_ID is required for zarinpal.`);
  }
}

class MockPaymentProvider implements PaymentProvider {
  async createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    return { redirectUrl: input.callbackUrl + '?status=OK&mock=1', authority: 'MOCK-' + Date.now().toString(36), gatewayRef: 'MOCKREF-' + Math.random().toString(36).slice(2) };
  }
  async verifyCallback(payload: any): Promise<PaymentVerification> {
    const status = String(payload?.status || payload?.Status || '').toUpperCase();
    return { ok: status === 'OK', reference: payload?.authority || payload?.Authority, raw: payload };
  }
}

class ZarinpalPaymentProvider implements PaymentProvider {
  private breaker = new CircuitBreaker(5, 5000);
  private client = new ZarinpalService();
  constructor(private merchantId: string) {}
  async createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    if (!this.merchantId) throw new Error('ZARINPAL_MERCHANT_ID missing');
    return this.breaker.exec(() => withBackoff(async () => {
      const res = await this.client.requestPayment(
        input.amount,
        input.meta?.description || 'ArmanVarzesh Payment',
        input.callbackUrl,
      );
      return { redirectUrl: res.paymentUrl, authority: res.Authority, gatewayRef: res.Authority };
    }));
  }
  async verifyCallback(payload: any): Promise<PaymentVerification> {
    const status = String(payload?.status || payload?.Status || '').toUpperCase();
    const authority = payload?.Authority || payload?.authority;
    const amount = Number(payload?.amount ?? payload?.Amount);
    // Never report success for missing/unknown status, missing authority or unknown amount.
    if (status !== 'OK' || !authority || !Number.isFinite(amount) || amount <= 0) {
      return { ok: false, reference: authority, raw: payload };
    }
    try {
      const res = await this.breaker.exec(() => withBackoff(() => this.client.verifyPayment(String(authority), amount)));
      return { ok: true, reference: res.RefID !== undefined ? String(res.RefID) : String(authority), raw: res.raw };
    } catch (e) {
      return { ok: false, reference: authority, raw: { payload, error: (e as Error).message } };
    }
  }
}
