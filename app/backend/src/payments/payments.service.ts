/**
PaymentsService
Encapsulates payment creation with idempotency and listing via keyset pagination.
@remarks
- Uses `SafePrismaService` for raw SQL execution with parameterization.
- Validates currency (ISO-4217 like) and idempotency key format/length.
@public
*/
import { Injectable, BadRequestException, ConflictException, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SafePrismaService } from '../common/database/prisma.safe';
import { requireMerchantId } from '../service/zarinpal.service';
import { MAX_PAYMENT_AMOUNT_RIAL, MIN_PAYMENT_AMOUNT_RIAL, isValidPaymentAmount } from './dto/amount-bounds';
import { PaymentVerification, PrismaPaymentStore, ZarinpalPaymentProvider, assertPaymentProviderConfigured } from './providers/payment.provider';

export interface CreatePaymentInput {
  userId: string;
  amountCents: number;
  currency: string;
  idempotencyKey?: string;
}

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

  async create(dto: CreatePaymentInput) {
    if (!dto?.userId) throw new BadRequestException('userId required');
    if (!dto?.currency || dto.currency.length !== 3) throw new BadRequestException('currency must be 3 letters');
    if (!isValidPaymentAmount(dto.amountCents)) {
      throw new BadRequestException(`amountCents must be an integer between ${MIN_PAYMENT_AMOUNT_RIAL} and ${MAX_PAYMENT_AMOUNT_RIAL} Rial`);
    }

    
    // Hard validation to mitigate injection and oversized input
    if (!/^[A-Za-z]{3}$/.test(dto.currency)) throw new BadRequestException('currency must be 3 letters (A-Z)');
    const idemKey = dto.idempotencyKey || `${dto.userId}-${dto.amountCents}-${dto.currency}`;
    if (!/^[A-Za-z0-9._-]{1,64}$/.test(idemKey)) throw new BadRequestException('invalid idempotency key');
const idem = idemKey || `${dto.userId}-${dto.amountCents}-${dto.currency}`;

    try {
      // Check existing by idempotency key (if table/column exist)
      const existed = await this.prisma.query<any>(Prisma.sql`SELECT id FROM payments WHERE idempotency_key = ${idem} LIMIT 1`);
      if (Array.isArray(existed) && existed.length > 0) {
        throw new ConflictException('Duplicate payment (idempotency)');
      }
    } catch (e: any) {
      // The duplicate rejection must escape — the blanket catch was swallowing
      // it, so duplicate payments were never actually rejected here.
      if (e instanceof ConflictException) throw e;
      // If table doesn't exist or column missing, continue to attempt insert and let DB decide
    }

    try {
      await this.prisma.exec(Prisma.sql`
        INSERT INTO payments (user_id, amount_cents, currency, idempotency_key, status, created_at)
        VALUES (${dto.userId}, ${dto.amountCents}, ${dto.currency.toUpperCase()}, ${idem}, 'CREATED', NOW())
      `);
      // Minimal response (avoid Prisma typings); real impl would return created row
      return { userId: dto.userId, amountCents: dto.amountCents, currency: dto.currency.toUpperCase(), idempotencyKey: idem, status: 'CREATED' };
    } catch (e: any) {
      // Unique violations or missing relation
      const msg = (e?.message || '').toLowerCase();
      if (msg.includes('unique') || e?.code === 'P2002') throw new ConflictException('Duplicate payment (unique key)');
      throw new InternalServerErrorException('payment.create failed');
    }
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


import { encodeCursor, decodeCursor, whereKeyset } from '../common/pagination/keyset';

export interface ListPaymentsInput {
  userId: string;
  limit?: number;
  cursor?: string;
}

export type PaymentRow = { id: string; user_id: string; amount_cents: number; currency: string; status: string; created_at: Date; idempotency_key?: string | null };

export async function toNextCursor(rows: PaymentRow[]): Promise<string | null> {
  if (!rows || rows.length === 0) return null;
  const last = rows[rows.length - 1];
  return encodeCursor(last.created_at, last.id);
}

export class PaymentsServiceExtended extends PaymentsService {
  async listByUser(input: ListPaymentsInput): Promise<{ items: PaymentRow[]; nextCursor: string | null }> {
    const limit = Math.max(1, Math.min(200, Number(input.limit ?? 20)));
    const cur = decodeCursor(input.cursor) ?? undefined;
    const sql = Prisma.sql`
      SELECT id, user_id, amount_cents, currency, status, created_at, idempotency_key
      FROM payments
      WHERE user_id = ${input.userId}
      ${whereKeyset(cur)}
      ORDER BY created_at DESC, id DESC
      LIMIT ${limit}
    `;
    const items = await (this as any).prisma.query(sql) as PaymentRow[];
    const nextCursor = await toNextCursor(items);
    return { items, nextCursor };
  }
}
