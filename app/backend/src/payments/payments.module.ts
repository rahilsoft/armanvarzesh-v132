import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../database/prisma.service';
import { CreatePaymentUseCase } from '../application/payments/create-payment.usecase';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, CreatePaymentUseCase],
  exports: [CreatePaymentUseCase]
})
export class PaymentsModule {}
