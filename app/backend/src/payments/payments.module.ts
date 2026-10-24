import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { ZarinpalPaymentsController } from './zarinpal.controller';
import { PrismaService } from '../database/prisma.service';
import { SafePrismaService } from '../common/database/prisma.safe';

@Module({
  controllers: [PaymentsController, CheckoutController, ZarinpalPaymentsController],
  providers: [PaymentsService, CheckoutService, PrismaService, SafePrismaService],
  exports: [CheckoutService]
})
export class PaymentsModule {}
