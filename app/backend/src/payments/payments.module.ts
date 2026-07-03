import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { PrismaService } from '../database/prisma.service';
import { SafePrismaService } from '../common/database/prisma.safe';
import { CreatePaymentUseCase } from '../application/payments/create-payment.usecase';

@Module({
  controllers: [PaymentsController, CheckoutController],
  providers: [PaymentsService, CheckoutService, PrismaService, SafePrismaService, CreatePaymentUseCase],
  exports: [CreatePaymentUseCase, CheckoutService]
})
export class PaymentsModule {}
