import { Injectable } from '@nestjs/common';
import { SafePrismaService } from '../prisma.safe';
import { decodeCursor, encodeCursor, whereKeyset } from '../../../common/pagination/keyset';
import type { Payment as PrismaPayment } from '@prisma/client';

/**
 * Payment entity used throughout the repository. By reusing the type from
 * `@prisma/client`, we ensure the fields remain in sync with the database
 * schema and avoid manual "any" casts. See {@link PaymentListResult} for
 * pagination semantics.
 */
export type Payment = PrismaPayment;

/**
 * Result type returned when listing payments. Contains the data slice and an
 * optional next cursor for keyset-based pagination.
 */
export interface PaymentListResult {
  data: Payment[];
  nextCursor?: string;
}

@Injectable()
export class PaymentRepository {
  constructor(private readonly db: SafePrismaService) {}

  async create(params: { userId: string; amountCents: number; currency: string; idempotencyKey?: string }) {
    const { userId, amountCents, currency, idempotencyKey } = params;
    const created = await this.db.payment.create({
      data: {
        user_id: userId,
        amount_cents: amountCents,
        currency,
        status: 'pending',
        idempotency_key: idempotencyKey ?? null,
      },
    });
    return created;
  }

  async findById(id: string): Promise<Payment | null> {
    const p = await this.db.payment.findUnique({ where: { id } });
    return p;
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<Payment | null> {
    const payment = await this.db.payment.findFirst({ where: { idempotency_key: idempotencyKey } });
    return payment;
  }

  async listByUser(userId: string, limit = 20, cursor?: string): Promise<PaymentListResult> {
    const parsed = decodeCursor(cursor);
    const rows = await this.db.$queryRawUnsafe<Payment[]>(
      `
        SELECT id, user_id, amount_cents, currency, status, created_at, idempotency_key
        FROM payments
        WHERE user_id = $1 AND (${whereKeyset(parsed).values.join(' ')})
        ORDER BY created_at DESC, id DESC
        LIMIT $2
      `,
      userId, limit + 1
    );
    const data: Payment[] = rows.slice(0, limit);
    let nextCursor: string | undefined;
    if (rows.length > limit) {
      const last = rows[limit - 1];
      nextCursor = encodeCursor(last.created_at, String(last.id));
    }
    return { data, nextCursor };
  }
}
