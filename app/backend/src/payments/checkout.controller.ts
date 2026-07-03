import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Public } from '../common/auth/public.decorator';
import { CurrentUser, AuthPrincipal } from '../common/auth/current-user.decorator';
import { verifyWebhookSignature } from '../common/security/webhook-signature';

/**
 * Live HTTP surface for the folded checkout/entitlement flow (closes D12
 * PAYMENTS-WIRE). User routes take identity from the JWT (not the body).
 * `/payments/checkout/webhook` is the public PSP callback — authenticated by
 * an HMAC signature (P0-2), and idempotent via PaymentEvent.eventId.
 */

class CheckoutDto {
  @IsString() @MinLength(1) productCode!: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

class ChangePlanDto {
  @IsString() @MinLength(1) newPlanCode!: string;
}

class WebhookDto {
  @IsString() @MinLength(1) provider!: string;
  @IsString() @MinLength(1) eventId!: string;
  @IsString() @MinLength(1) type!: string;
  @IsObject() payload!: { sessionId?: string; paymentId?: string; [k: string]: unknown };
  @IsOptional() @IsString() signature?: string;
}

@Controller('payments/checkout')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class CheckoutController {
  constructor(private readonly checkout: CheckoutService) {}

  @Post()
  create(@CurrentUser() user: AuthPrincipal, @Body() dto: CheckoutDto) {
    return this.checkout.checkout(user.userId, dto.productCode, dto.metadata);
  }

  @Post('change-plan')
  changePlan(@CurrentUser() user: AuthPrincipal, @Body() dto: ChangePlanDto) {
    return this.checkout.changePlan(user.userId, dto.newPlanCode);
  }

  // Public: PSP → server callback. No bearer token; authenticated by HMAC over
  // the raw body using PAYMENTS_WEBHOOK_SECRET.
  @Public()
  @Post('webhook')
  webhook(@Body() dto: WebhookDto) {
    verifyWebhookSignature('payments', dto, process.env.PAYMENTS_WEBHOOK_SECRET);
    return this.checkout.webhook(dto.provider, dto.eventId, dto.type, dto.payload);
  }

  @Post('seed-products')
  async seed() {
    await this.checkout.seedProducts();
    return { ok: true };
  }
}
