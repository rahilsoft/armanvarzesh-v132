/**
PaymentsService
Encapsulates payment creation with idempotency and listing via keyset pagination.
@remarks
- Uses `SafePrismaService` for raw SQL execution with parameterization.
- Validates currency (ISO-4217 like) and idempotency key format/length.
@public
*/
import { Injectable, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SafePrismaService } from '../common/database/prisma.safe';

export interface CreatePaymentInput {
  userId: string;
  amountCents: number;
  currency: string;
  idempotencyKey?: string;
}

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: SafePrismaService) {}

  async create(dto: CreatePaymentInput) {
    if (!dto?.userId) throw new BadRequestException('userId required');
    if (!dto?.currency || dto.currency.length !== 3) throw new BadRequestException('currency must be 3 letters');
    if (!Number.isFinite(dto.amountCents) || dto.amountCents <= 0) throw new BadRequestException('amountCents must be > 0');

    
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
    const cur = decodeCursor(input.cursor);
    const sql = Prisma.sql`
      SELECT id, user_id, amount_cents, currency, status, created_at, idempotency_key
      FROM payments
      WHERE user_id = ${input.userId}
      ${whereKeyset(cur)}
      ORDER BY created_at DESC, id DESC
      LIMIT ${limit}
    `;
    const items = await (this as any).prisma.query<PaymentRow>(sql);
    const nextCursor = await toNextCursor(items);
    return { items, nextCursor };
  }
}
