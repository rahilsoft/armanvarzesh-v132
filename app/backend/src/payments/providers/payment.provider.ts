import { withBackoff, CircuitBreaker } from '../../common/retry/circuitBreaker';

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
  const provider = (process.env.PAYMENT_PROVIDER || 'mock').toLowerCase();
  switch (provider) {
    case 'zarinpal': return new ZarinpalPaymentProvider(process.env.ZARINPAL_MERCHANT_ID || '');
    default: return new MockPaymentProvider();
  }
}

class MockPaymentProvider implements PaymentProvider {
  async createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    return { redirectUrl: input.callbackUrl + '?status=OK&mock=1', authority: 'MOCK-' + Date.now().toString(36), gatewayRef: 'MOCKREF-' + Math.random().toString(36).slice(2) };
  }
  async verifyCallback(payload: any): Promise<PaymentVerification> {
    const status = (payload?.status || payload?.Status || 'OK').toUpperCase();
    return { ok: status === 'OK', reference: payload?.authority || payload?.Authority || 'MOCK', raw: payload };
  }
}

class ZarinpalPaymentProvider implements PaymentProvider {
  private breaker = new CircuitBreaker(5, 5000);
  constructor(private merchantId: string) {}
  async createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    if (!this.merchantId) throw new Error('ZARINPAL_MERCHANT_ID missing');
    return this.breaker.exec(() => withBackoff(async () => {
      // Dynamic import; if not installed, fall back to mock flow
      try {
        const mod: any = await import('zarinpal-checkout'); // optional dep
        const zarinpal = mod.create(this.merchantId, true);
        const res = await zarinpal.PaymentRequest({
          Amount: input.amount,
          CallbackURL: input.callbackUrl,
          Description: input.meta?.description || 'ArmanVarzesh Payment',
        });
        if (res.status === 100) {
          return { redirectUrl: res.url, authority: res.authority, gatewayRef: res.authority };
        }
        throw new Error('Zarinpal error status ' + res.status);
      } catch (e) {
        // Fallback: degrade to mock-like for non-prod or missing dep
        if (process.env.APP_ENV !== 'production') {
          return { redirectUrl: input.callbackUrl + '?status=OK&fallback=1', authority: 'ZP-FALLBACK-' + Date.now().toString(36) };
        }
        throw e;
      }
    }));
  }
  async verifyCallback(payload: any): Promise<PaymentVerification> {
    // Dynamic import w/ backoff
    return this.breaker.exec(() => withBackoff(async () => {
      try {
        const mod: any = await import('zarinpal-checkout');
        const zarinpal = mod.create(this.merchantId, true);
        const status = (payload?.status || payload?.Status || '').toString();
        const authority = payload?.Authority || payload?.authority;
        if (status.toUpperCase() === 'OK' && authority) {
          return { ok: true, reference: authority, raw: payload };
        }
        return { ok: false, reference: authority, raw: payload };
      } catch {
        // Fallback in non-prod
        if (process.env.APP_ENV !== 'production') {
          const authority = payload?.Authority || payload?.authority || 'ZP';
          return { ok: true, reference: authority, raw: payload };
        }
        return { ok: false, raw: payload };
      }
    }));
  }
}
