import { Injectable } from '@nestjs/common';
import { UseCase } from '../core/usecase';
import { PaymentsService } from '../../payments/payments.service';
import { CreatePaymentDto } from '../../payments/dto/create-payment.dto';

@Injectable()
export class CreatePaymentUseCase implements UseCase<CreatePaymentDto, any> {
  constructor(private readonly payments: PaymentsService) {}
  async execute(input: CreatePaymentDto) {
    // Delegates to service; validation is handled via DTO + ValidationPipe
    return await this.payments.create({
      userId: input.userId,
      amountCents: input.amountCents,
      currency: input.currency,
      idempotencyKey: input.idempotencyKey,
    });
  }
}
