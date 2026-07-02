import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsInt, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { CheckoutService } from './checkout.service';

/**
 * Live HTTP surface for the folded checkout/entitlement flow (closes D12
 * PAYMENTS-WIRE). `/payments/checkout/webhook` is the public PSP callback —
 * idempotency is enforced inside CheckoutService via PaymentEvent.eventId.
 */

class CheckoutDto {
  @IsInt() userId!: number;
  @IsString() @MinLength(1) productCode!: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

class ChangePlanDto {
  @IsInt() userId!: number;
  @IsString() @MinLength(1) newPlanCode!: string;
}

class WebhookDto {
  @IsString() @MinLength(1) provider!: string;
  @IsString() @MinLength(1) eventId!: string;
  @IsString() @MinLength(1) type!: string;
  @IsObject() payload!: { sessionId?: string; paymentId?: string; [k: string]: unknown };
}

@Controller('payments/checkout')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class CheckoutController {
  constructor(private readonly checkout: CheckoutService) {}

  @Post()
  create(@Body() dto: CheckoutDto) {
    return this.checkout.checkout(dto.userId, dto.productCode, dto.metadata);
  }

  @Post('change-plan')
  changePlan(@Body() dto: ChangePlanDto) {
    return this.checkout.changePlan(dto.userId, dto.newPlanCode);
  }

  @Post('webhook')
  webhook(@Body() dto: WebhookDto) {
    return this.checkout.webhook(dto.provider, dto.eventId, dto.type, dto.payload);
  }

  @Post('seed-products')
  async seed() {
    await this.checkout.seedProducts();
    return { ok: true };
  }
}
