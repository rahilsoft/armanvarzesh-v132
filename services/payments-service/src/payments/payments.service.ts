import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private prisma = new PrismaClient();
  private stripe: Stripe;

  constructor() {
    const key = "__CHANGE_ME__"
    this.stripe = new Stripe(key, { apiVersion: '2024-06-20' as any });
  }

  async createProduct(dto: {name: string; priceCents: number; currency?: string}) {
    const p = await this.prisma.product.create({ data: { name: dto.name, priceCents: dto.priceCents, currency: dto.currency || 'USD' }});
    return p;
  }

  async listProducts() {
    return this.prisma.product.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20,  where: { isActive: true }});
  }

  async createCoupon(dto: {code: string; percentOff: number}) {
    if (dto.percentOff <= 0 || dto.percentOff > 90) throw new BadRequestException('percentOff 1..90');
    return this.prisma.coupon.create({ data: { code: dto.code.toUpperCase(), percentOff: dto.percentOff }});
  }

  async createOrder(dto: {userId: string; productId: string; couponCode?: string}) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId }});
    if (!product) throw new BadRequestException('Product not found');
    let price = product.priceCents;
    if (dto.couponCode) {
      const c = await this.prisma.coupon.findUnique({ where: { code: dto.couponCode.toUpperCase() }});
      if (c?.active) price = Math.floor(price * (100 - c.percentOff) / 100);
    }
    const order = await this.prisma.order.create({ data: {
      userId: dto.userId, productId: product.id, priceCents: price, currency: product.currency
    }});
    return order;
  }

  async createPaymentIntent(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { payments: true, product: true }});
    if (!order) throw new BadRequestException('Order not found');
    const intent = await this.stripe.paymentIntents.create({
      amount: order.priceCents,
      currency: (order.currency || 'USD').toLowerCase(),
      metadata: { orderId: order.id, userId: order.userId },
      automatic_payment_methods: { enabled: true },
    });
    await this.prisma.payment.create({ data: {
      orderId: order.id, provider: 'stripe', intentId: intent.id, status: intent.status, raw: intent as any
    }});
    return { clientSecret: intent.client_secret };
  }

  async handleWebhook(sig: string, rawBody: Buffer) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    let event: Stripe.Event;
    try {
      if (endpointSecret) {
        event = this.stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
      } else {
        event = JSON.parse(rawBody.toString());
      }
    } catch (err: any) {
      throw new BadRequestException('Webhook signature verification failed: ' + err.message);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = (pi.metadata as any)?.orderId;
        if (orderId) {
          await this.prisma.order.update({ where: { id: orderId }, data: { status: 'paid' }});
          await this.prisma.payment.updateMany({ where: { intentId: pi.id }, data: { status: 'succeeded', raw: pi as any }});
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        await this.prisma.payment.updateMany({ where: { intentId: pi.id }, data: { status: 'failed', raw: pi as any }});
        break;
      }
    }
    return { received: true };
  }

  async createSubscription(dto: {userId: string; productId: string}) {
    // Simplified local record creation; integration with Stripe products/prices can be added.
    const sub = await this.prisma.subscription.create({
      data: { userId: dto.userId, productId: dto.productId, status: 'active' }
    });
    return sub;
  }
}