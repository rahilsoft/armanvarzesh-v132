import { Injectable } from '@nestjs/common';
import { SafePrismaService } from '../prisma.safe';
import type { Payment as PrismaPayment } from '@prisma/client';

/**
 * Payment entity, kept in sync with the database via the generated Prisma type.
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

  async create(params: { userId: string; amountCents: number; currency?: string; idempotencyKey?: string }) {
    const { userId, amountCents, idempotencyKey } = params;
    return this.db.payment.create({
      data: {
        userId: Number(userId),
        amount: amountCents,
        status: 'pending',
        authority: idempotencyKey ?? `pay_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      },
    });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.db.payment.findUnique({ where: { id: Number(id) } });
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<Payment | null> {
    return this.db.payment.findUnique({ where: { authority: idempotencyKey } });
  }

  async listByUser(userId: string, limit = 20, cursor?: string): Promise<PaymentListResult> {
    const where: { userId: number; id?: { lt: number } } = { userId: Number(userId) };
    if (cursor) where.id = { lt: Number(cursor) };
    const rows = await this.db.payment.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });
    const data = rows.slice(0, limit);
    let nextCursor: string | undefined;
    if (rows.length > limit) nextCursor = String(rows[limit - 1].id);
    return { data, nextCursor };
  }
}
