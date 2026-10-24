/**
PaymentsService
Zarinpal request/verify over the persisted "Payment" table, plus per-user listing.
@remarks
- Uses `SafePrismaService` for raw SQL execution with parameterization.
@public
*/
import { Injectable, BadRequestException, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SafePrismaService } from '../common/database/prisma.safe';
import { requireMerchantId } from '../service/zarinpal.service';
import { MAX_PAYMENT_AMOUNT_RIAL, MIN_PAYMENT_AMOUNT_RIAL, isValidPaymentAmount } from './dto/amount-bounds';
import { PaymentVerification, PrismaPaymentStore, ZarinpalPaymentProvider, assertPaymentProviderConfigured } from './providers/payment.provider';

@Injectable()
export class PaymentsService implements OnModuleInit {
  constructor(private readonly prisma: SafePrismaService) {}

  /** Fail fast at startup: outside development/test an unset or mock provider aborts boot. */
  onModuleInit(): void {
    assertPaymentProviderConfigured();
  }

  /** Real Zarinpal provider over the persisted "Payment" table. Re-checks config on every use. */
  private zarinpal(): ZarinpalPaymentProvider {
    assertPaymentProviderConfigured();
    return new ZarinpalPaymentProvider(requireMerchantId(), new PrismaPaymentStore(this.prisma));
  }

  async findAll() {
    const rows = await this.prisma.query<any>(
      Prisma.sql`SELECT id, "userId", amount, authority, status, "createdAt" FROM "Payment" ORDER BY "createdAt" DESC LIMIT 100`,
    );
    return Array.isArray(rows) ? rows : [];
  }

  async findOne(id: string | number) {
    const rows = await this.prisma.query<any>(
      Prisma.sql`SELECT id, "userId", amount, authority, status, "createdAt" FROM "Payment" WHERE id = ${Number(id)} LIMIT 1`,
    );
    return Array.isArray(rows) && rows.length ? rows[0] : null;
  }

  /**
   * Verifies through the real Zarinpal verify path: the stored amount is sent to the
   * gateway, unknown authorities are rejected and the row is marked paid only after
   * Zarinpal confirms (idempotent on repeated calls). `status` is the gateway callback
   * Status and is required: a missing or non-OK status is rejected without calling the
   * gateway. There is no default.
   */
  async verify(authority: string, amount: number | undefined, status: string): Promise<boolean> {
    const res = await this.verifyDetailed(authority, amount, status);
    return res.ok;
  }

  async verifyDetailed(authority: string, amount: number | undefined, status: string): Promise<PaymentVerification> {
    if (typeof status !== 'string' || status.trim() === '') {
      return { ok: false, reference: authority || undefined, reason: 'invalid_callback' };
    }
    return this.zarinpal().verifyCallback({ Status: status, Authority: authority, Amount: amount });
  }

  async verifyPayment(authority: string, amount: number | undefined, status: string) {
    const ok = await this.verify(authority, amount, status);
    return { authority, amount, status: ok ? 'paid' : 'failed', ok };
  }

  /**
   * Requests a Zarinpal payment and persists authority + amount + status 'pending'
   * into the same "Payment" table the verify path reads, so create -> verify works.
   */
  async requestPayment(input: { amount: number; callbackUrl: string; userId?: number | null; description?: string }): Promise<{ authority: string; redirectUrl: string }> {
    if (!isValidPaymentAmount(input?.amount)) {
      throw new BadRequestException(`amount must be an integer between ${MIN_PAYMENT_AMOUNT_RIAL} and ${MAX_PAYMENT_AMOUNT_RIAL} Rial`);
    }
    if (!input?.callbackUrl) throw new BadRequestException('callbackUrl required');
    assertPaymentProviderConfigured();
    const store = new PrismaPaymentStore(this.prisma);
    const provider = new ZarinpalPaymentProvider(requireMerchantId(), store);
    const res = await provider.createPayment({ amount: input.amount, callbackUrl: input.callbackUrl, meta: { description: input.description } });
    if (!res.authority || !res.redirectUrl) throw new InternalServerErrorException('payment.request failed');
    await store.createPending({ authority: res.authority, amount: input.amount, userId: input.userId ?? null });
    return { authority: res.authority, redirectUrl: res.redirectUrl };
  }

  async listByUser(input: { userId: string | number; limit?: number; cursor?: string }): Promise<{ items: any[]; nextCursor: string | null }> {
    const limit = input.limit ?? 20;
    const rows = await this.prisma.query<any>(
      Prisma.sql`SELECT id, "userId", amount, authority, status, "createdAt" FROM "Payment" WHERE "userId" = ${Number(input.userId)} ORDER BY "createdAt" DESC LIMIT ${limit}`,
    );
    return { items: Array.isArray(rows) ? rows : [], nextCursor: null };
  }
}

