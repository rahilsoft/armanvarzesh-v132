import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly svc: PaymentsService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('products')
  createProduct(@Body() dto: {name: string; priceCents: number; currency?: string}) {
    return this.svc.createProduct(dto);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get('products')
  listProducts() {
    return this.svc.listProducts();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post('orders')
  createOrder(@Body() dto: {userId: string; productId: string; couponCode?: string}) {
    return this.svc.createOrder(dto);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('intent/:orderId')
  createPaymentIntent(@Param('orderId') orderId: string) {
    return this.svc.createPaymentIntent(orderId);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('webhook')
  webhook(@Req() req: any) {
    // raw body expected: ensure main.ts uses raw body for this route
    return this.svc.handleWebhook(req.headers['stripe-signature'], req.rawBody);
  }

  @Post('subscriptions')
  createSubscription(@Body() dto: {userId: string; productId: string}) {
    return this.svc.createSubscription(dto);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post('coupons')
  createCoupon(@Body() dto: {code: string; percentOff: number}) {
    return this.svc.createCoupon(dto);
  }
}