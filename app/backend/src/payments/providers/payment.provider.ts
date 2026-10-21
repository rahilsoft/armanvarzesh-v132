import { Prisma } from '@prisma/client';
import { withBackoff, CircuitBreaker } from '../../common/retry/circuitBreaker';
import { ZarinpalService, requireMerchantId, isRetryableGatewayError } from '../../service/zarinpal.service';

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
  /** Amount stored for this payment (never the client-supplied amount). */
  amount?: number;
  /** True when the payment was already settled and this call did not re-credit it. */
  alreadyPaid?: boolean;
  /** Machine-readable reason when ok is false. */
  reason?: 'invalid_callback' | 'unknown_authority' | 'amount_mismatch' | 'gateway_rejected' | 'not_settled';
  raw?: any;
}

export interface PaymentProvider {
  createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult>;
  verifyCallback(payload: any): Promise<PaymentVerification>;
}

/** A payment as persisted when it was created (source of truth for the expected amount). */
export interface StoredPayment {
  authority: string;
  amount: number;
  status: string;
}

/** Persistence port used by the Zarinpal verify path. */
export interface PaymentStore {
  findByAuthority(authority: string): Promise<StoredPayment | null>;
  /**
   * Atomically transitions the payment to paid. Must only update a row that matches
   * the authority and expected amount and is not paid yet. Returns true only when
   * this call performed the transition.
   */
  markPaid(authority: string, expectedAmount: number): Promise<boolean>;
}

export const PAID_STATUS = 'paid';
export const PENDING_STATUS = 'pending';

/** Write side used when a payment is requested: persists the row verify later reads. */
export interface PendingPaymentWriter {
  createPending(input: { authority: string; amount: number; userId?: number | null }): Promise<void>;
}

/**
 * Runs a gateway call through backoff + breaker. Only transport failures (network,
 * timeout, 5xx) are retried and counted by the breaker. Business rejections are
 * passed through without retry and without tripping the breaker.
 */
export async function guardedGatewayCall<T>(breaker: CircuitBreaker, fn: () => Promise<T>): Promise<T> {
  const out = await breaker.exec(() =>
    withBackoff(async () => {
      try {
        return { value: await fn() } as { value?: T; rejected?: unknown };
      } catch (e) {
        if (!isRetryableGatewayError(e)) return { rejected: e } as { value?: T; rejected?: unknown };
        throw e;
      }
    }),
  );
  if ('rejected' in out) throw out.rejected;
  return out.value as T;
}

interface RawSqlClient {
  query<T = unknown>(sql: Prisma.Sql): Promise<T>;
  exec(sql: Prisma.Sql): Promise<number>;
}

/** Prisma-backed store over the `Payment` model (parameterized raw SQL via SafePrismaService). */
export class PrismaPaymentStore implements PaymentStore, PendingPaymentWriter {
  constructor(private readonly db: RawSqlClient) {}

  async createPending(input: { authority: string; amount: number; userId?: number | null }): Promise<void> {
    const userId = input.userId ?? null;
    await this.db.exec(
      Prisma.sql`INSERT INTO "Payment" (authority, amount, status, "userId") VALUES (${input.authority}, ${input.amount}, ${PENDING_STATUS}, ${userId}) ON CONFLICT (authority) DO NOTHING`,
    );
  }

  async findByAuthority(authority: string): Promise<StoredPayment | null> {
    const rows = await this.db.query<any[]>(
      Prisma.sql`SELECT authority, amount, status FROM "Payment" WHERE authority = ${authority} LIMIT 1`,
    );
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const r = rows[0];
    return { authority: String(r.authority), amount: Number(r.amount), status: String(r.status ?? '') };
  }

  async markPaid(authority: string, expectedAmount: number): Promise<boolean> {
    const n = await this.db.exec(
      Prisma.sql`UPDATE "Payment" SET status = ${PAID_STATUS} WHERE authority = ${authority} AND amount = ${expectedAmount} AND status <> ${PAID_STATUS}`,
    );
    return Number(n) === 1;
  }
}

/** Minimal Zarinpal client surface used by the provider (real impl: ZarinpalService). */
export interface ZarinpalClient {
  requestPayment(amount: number, description: string, callbackUrl?: string): Promise<{ Authority: string; paymentUrl: string }>;
  verifyPayment(authority: string, amount: number): Promise<{ Status: number; RefID: string | number | undefined; raw?: any }>;
}

/** True only when NODE_ENV is exactly 'development' or 'test'. */
export function isMockPaymentAllowed(env: string | undefined = process.env.NODE_ENV): boolean {
  return env === 'test' || env === 'development';
}

/**
 * Validates the payment provider configuration and returns the normalized provider name.
 * Outside NODE_ENV development/test, PAYMENT_PROVIDER must be set to a real provider
 * (zarinpal) and ZARINPAL_MERCHANT_ID must be present: an unset or 'mock' provider is a
 * hard failure, never an implicit fallback. Called at module init (fail fast at startup)
 * and before every gateway call.
 */
export function assertPaymentProviderConfigured(): 'zarinpal' | 'mock' {
  const raw = (process.env.PAYMENT_PROVIDER || '').trim().toLowerCase();
  const mockAllowed = isMockPaymentAllowed();
  if (!raw) {
    if (!mockAllowed) {
      throw new Error('PAYMENT_PROVIDER is not set. Set PAYMENT_PROVIDER=zarinpal and ZARINPAL_MERCHANT_ID (the mock provider is only allowed when NODE_ENV is test or development).');
    }
    return 'mock';
  }
  switch (raw) {
    case 'zarinpal':
      requireMerchantId();
      return 'zarinpal';
    case 'mock':
      if (!mockAllowed) {
        throw new Error('PAYMENT_PROVIDER=mock is forbidden unless NODE_ENV is test or development. Use PAYMENT_PROVIDER=zarinpal with ZARINPAL_MERCHANT_ID.');
      }
      return 'mock';
    default:
      throw new Error(`Unknown PAYMENT_PROVIDER "${raw}". Supported: zarinpal (and mock in test/development). ZARINPAL_MERCHANT_ID is required for zarinpal.`);
  }
}

export function makePaymentProvider(store?: PaymentStore): PaymentProvider {
  const kind = assertPaymentProviderConfigured();
  if (kind === 'mock') return new MockPaymentProvider();
  if (!store) {
    throw new Error('Zarinpal provider requires a PaymentStore (database) to verify callbacks against the stored amount.');
  }
  return new ZarinpalPaymentProvider(requireMerchantId(), store);
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

export class ZarinpalPaymentProvider implements PaymentProvider {
  private readonly breaker = new CircuitBreaker(5, 5000);
  getBreakerState() {
    return this.breaker.getState();
  }
  constructor(
    private readonly merchantId: string,
    private readonly store: PaymentStore,
    private readonly client: ZarinpalClient = new ZarinpalService(),
  ) {
    if (!merchantId) throw new Error('ZARINPAL_MERCHANT_ID missing');
    if (!store) throw new Error('PaymentStore is required for Zarinpal verification');
  }

  async createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    const res = await guardedGatewayCall(this.breaker, () =>
      this.client.requestPayment(input.amount, input.meta?.description || 'ArmanVarzesh Payment', input.callbackUrl),
    );
    return { redirectUrl: res.paymentUrl, authority: res.Authority, gatewayRef: res.Authority };
  }

  /**
   * Verifies a Zarinpal callback. The amount sent to Zarinpal verify is always the
   * amount stored for this authority, never the client-supplied one. Idempotent: a
   * repeated callback for a paid authority returns the existing result and neither
   * calls the gateway nor re-credits.
   */
  async verifyCallback(payload: any): Promise<PaymentVerification> {
    const status = String(payload?.status || payload?.Status || '').toUpperCase();
    const rawAuthority = payload?.Authority ?? payload?.authority;
    const authority = typeof rawAuthority === 'string' ? rawAuthority.trim() : '';
    if (status !== 'OK' || !authority || authority.length > 128) {
      return { ok: false, reference: authority || undefined, reason: 'invalid_callback' };
    }

    const stored = await this.store.findByAuthority(authority);
    if (!stored) {
      return { ok: false, reference: authority, reason: 'unknown_authority' };
    }
    const expected = Number(stored.amount);
    if (!Number.isFinite(expected) || expected <= 0) {
      return { ok: false, reference: authority, reason: 'amount_mismatch' };
    }

    // A client-supplied amount is never used, but when present it must match the stored one.
    const claimedRaw = payload?.amount ?? payload?.Amount;
    if (claimedRaw !== undefined && claimedRaw !== null && claimedRaw !== '' && Number(claimedRaw) !== expected) {
      return { ok: false, reference: authority, amount: expected, reason: 'amount_mismatch' };
    }

    if (stored.status === PAID_STATUS) {
      return { ok: true, reference: authority, amount: expected, alreadyPaid: true };
    }

    let res: { Status: number; RefID: string | number | undefined; raw?: any };
    try {
      res = await guardedGatewayCall(this.breaker, () => this.client.verifyPayment(authority, expected));
    } catch (e) {
      return { ok: false, reference: authority, amount: expected, reason: 'gateway_rejected', raw: { error: (e as Error).message } };
    }
    const code = Number(res?.Status);
    if (code !== 100 && code !== 101) {
      return { ok: false, reference: authority, amount: expected, reason: 'gateway_rejected', raw: res?.raw };
    }
    const reference = res.RefID !== undefined ? String(res.RefID) : authority;

    const transitioned = await this.store.markPaid(authority, expected);
    if (transitioned) {
      return { ok: true, reference, amount: expected, alreadyPaid: false, raw: res.raw };
    }
    // Lost a race with a concurrent callback: report the settled state without re-crediting.
    const after = await this.store.findByAuthority(authority);
    if (after?.status === PAID_STATUS) {
      return { ok: true, reference, amount: expected, alreadyPaid: true, raw: res.raw };
    }
    return { ok: false, reference: authority, amount: expected, reason: 'not_settled', raw: res.raw };
  }
}
