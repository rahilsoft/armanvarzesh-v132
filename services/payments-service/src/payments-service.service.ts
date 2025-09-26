import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private prisma = new PrismaClient();
  private stripe: Stripe | null;

  constructor() {
    const key = process.env.STRIPE_SECRET;
    this.stripe = key ? new Stripe(key, { apiVersion: '2024-06-20' as any }) : null;
  }

  // Products
  async createProduct(dto: { name: string; priceCents: number; currency?: string }) {
    if (!dto?.name || !dto?.priceCents) throw new BadRequestException('name/priceCents required');
    return this.prisma.product.create({ data: { name: dto.name, priceCents: dto.priceCents, currency: dto.currency || 'USD' } });
  }

  async listProducts() {
    return this.prisma.product.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20,  where: { isActive: true } });
  }

  // Coupons
  async createCoupon(code: string, percentOff: number) {
    if (!code || percentOff < 0 || percentOff > 100) throw new BadRequestException('invalid coupon');
    return this.prisma.coupon.create({ data: { code, percentOff, active: true } });
  }

  // Orders
  async createOrder(userId: string, productId: string, couponCode?: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    let amount = product.priceCents;
    let couponId: string | undefined;
    if (couponCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.active) {
        amount = Math.max(0, Math.floor(amount * (100 - coupon.percentOff) / 100));
        couponId = coupon.id;
      }
    }

    return this.prisma.order.create({
      data: { userId, productId, amountCents: amount, currency: product.currency, couponId, status: OrderStatus.PENDING }
    });
  }

  async getOrder(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { payments: true, product: true, coupon: true } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // Payments / Intents
  async createIntent(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { payments: true, product: true } });
    if (!order) throw new NotFoundException('Order not found');

    if (!this.stripe) {
      // mock path in dev without stripe
      const payment = await this.prisma.payment.create({
        data: { orderId: order.id, status: PaymentStatus.SUCCEEDED, provider: 'mock', raw: { mock: true } }
      });
      await this.prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.PAID } });
      return { id: payment.id, clientSecret: process.env.SECRET || "changeme"succeeded' };
    }

    const intent = await this.stripe.paymentIntents.create({
      amount: order.amountCents,
      currency: order.currency.toLowerCase(),
      metadata: { orderId: order.id }
    });
    await this.prisma.payment.create({
      data: { orderId: order.id, intentId: intent.id, status: PaymentStatus.PENDING, provider: 'stripe', raw: intent as any }
    });
    await this.prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.REQUIRES_PAYMENT } });
    return { clientSecret: intent.client_secret, intentId: intent.id };
  }

  async handleWebhook(rawBody: Buffer, sig?: string) {
    if (!this.stripe) {
      return { ok: true, provider: 'mock' };
    }
    const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;
    if (whSecret && sig) {
      event = this.stripe.webhooks.constructEvent(rawBody, sig, whSecret);
    } else {
      event = JSON.parse(rawBody.toString());
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = (intent.metadata as any)?.orderId;
      if (orderId) {
        await this.prisma.payment.updateMany({ where: { intentId: intent.id }, data: { status: PaymentStatus.SUCCEEDED, raw: intent as any } });
        await this.prisma.order.update({ where: { id: orderId }, data: { status: OrderStatus.PAID } });
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as Stripe.PaymentIntent;
      await this.prisma.payment.updateMany({ where: { intentId: intent.id }, data: { status: PaymentStatus.FAILED, raw: event as any } });
    }

    return { received: true };
  }

  // Subscriptions (basic)
  async createPlan(productId: string, interval: 'month'|'year', priceCents: number, trialDays?: number) {
    return this.prisma.subscriptionPlan.create({ data: { productId, interval, priceCents, currency: 'USD', trialDays, isActive: true } });
  }

  async subscribe(userId: string, planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId }, include: { product: true } });
    if (!plan) throw new NotFoundException('Plan not found');

    let providerSubId: string | undefined;
    if (this.stripe) {
      const customer = await this.ensureStripeCustomer(userId);
      const price = plan.priceCents; // In real life, attach to Stripe price id
      const sub = await this.stripe.subscriptions.create({
        customer: customer.providerId,
        items: [{ price_data: { currency: plan.currency.toLowerCase(), product_data: { name: plan.product.name }, unit_amount: price, recurring: { interval: plan.interval } } }],
        trial_period_days: plan.trialDays || undefined
      });
      providerSubId = sub.id;
    }

    const currentPeriodEnd = plan.trialDays ? new Date(Date.now() + plan.trialDays * 86400000) : null;
    return this.prisma.subscription.create({ data: { userId, planId, providerSubId, currentPeriodEnd } });
  }

  private async ensureStripeCustomer(userId: string) {
    // simplistic local mapping; in real case we'd store email, etc.
    let c = await this.prisma.customer.findUnique({ where: { userId } });
    if (c) return c;
    if (!this.stripe) {
      c = await this.prisma.customer.create({ data: { userId, provider: 'mock', providerId: `mock_${userId}` } });
      return c;
    }
    const sc = await this.stripe.customers.create({});
    c = await this.prisma.customer.create({ data: { userId, provider: 'stripe', providerId: sc.id } });
    return c;
  }
}