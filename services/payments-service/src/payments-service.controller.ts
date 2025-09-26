import { Body, Controller, Get, Headers, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments-service.service';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
export class Payments_serviceController {
  constructor(private readonly svc: PaymentsService) {}

  // Products
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('products')
  createProduct(@Body() dto: any) {
    return this.svc.createProduct(dto);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get('products')
  listProducts() {
    return this.svc.listProducts();
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  // Coupons
  @Post('coupons')
  createCoupon(@Body() dto: any) {
    return this.svc.createCoupon(dto.code, dto.percentOff);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  // Orders
  @Post('orders')
  createOrder(@Body() dto: any) {
    return this.svc.createOrder(dto.userId, dto.productId, dto.couponCode);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.svc.getOrder(id);
  }

  // Payment Intent
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('intent/:orderId')
  createIntent(@Param('orderId') orderId: string) {
    return this.svc.createIntent(orderId);
  }

  // Webhook (raw body)
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('webhook')
  webhook(@Req() req: any, @Headers('stripe-signature') sig?: string) {
    return this.svc.handleWebhook(req.rawBody || req.body, sig);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  // Subscriptions
  @Post('plans')
  createPlan(@Body() dto: any) {
    return this.svc.createPlan(dto.productId, dto.interval, dto.priceCents, dto.trialDays);
  }

  @Post('subscriptions')
  subscribe(@Body() dto: any) {
    return this.svc.subscribe(dto.userId, dto.planId);
  }
}