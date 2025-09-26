import { Injectable } from '@nestjs/common';
import type { PaymentRepository } from '../data/repositories/payment.repository';
import { ValidationError } from './errors';
import { assertCurrency, assertPositiveAmount } from './validators';
import type { CreatePaymentInput, PaymentList } from './types';

@Injectable()
export class PaymentsUseCase {
  constructor(private readonly payments: PaymentRepository) {}

  /** Idempotent payment creation */
  async create(input: CreatePaymentInput) {
    assertPositiveAmount(input.amountCents);
    assertCurrency(input.currency);

    if (input.idempotencyKey) {
      const existed = await this.payments.findByIdempotencyKey(input.idempotencyKey);
      if (existed) return existed;
    }
    return this.payments.create({
      userId: input.userId,
      amountCents: input.amountCents,
      currency: input.currency.toUpperCase(),
      idempotencyKey: input.idempotencyKey,
    });
  }

  async listByUser(userId: string, limit = 20, cursor?: string): Promise<PaymentList> {
    if (!userId) throw new ValidationError('userId is required', 'userId');
    if (!Number.isInteger(limit) || limit <= 0 || limit > 100) {
      throw new ValidationError('limit must be between 1 and 100', 'limit');
    }
    return this.payments.listByUser(userId, limit, cursor);
  }
}
