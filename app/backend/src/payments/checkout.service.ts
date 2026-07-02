import { randomUUID } from 'crypto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/**
 * Checkout / entitlement flow, folded from the former services/payments-service
 * into the modular monolith (core Int PKs; PSP identifiers preserved as
 * `String @unique` external references). Behaviour-preserving, with two
 * deliberate improvements documented inline:
 *  1. session/event ids use `crypto.randomUUID()` instead of a hand-rolled
 *     pseudo-uuid;
 *  2. the booking notification is emitted to the DomainEventOutbox instead of a
 *     direct HTTP call to booking-service — removing a synchronous cross-service
 *     coupling. An outbox relay/worker delivers it.
 */

export interface CheckoutResult {
  sessionId: string; // providerSessionId
  checkoutUrl: string;
  amountCents: number;
  currency: string;
}

const DEFAULT_PLANS = [
  { code: 'plan-basic', kind: 'plan', name: 'Basic Monthly', amountCents: 990, currency: 'EUR', interval: 'month' },
  { code: 'plan-pro', kind: 'plan', name: 'Pro Monthly', amountCents: 1990, currency: 'EUR', interval: 'month' },
] as const;

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  async seedProducts(): Promise<void> {
    for (const p of DEFAULT_PLANS) {
      await this.prisma.product.upsert({ where: { code: p.code }, update: {}, create: { ...p } });
    }
  }

  async checkout(userId: number, productCode: string, metadata?: Record<string, unknown>): Promise<CheckoutResult> {
    const product = await this.prisma.product.findUnique({ where: { code: productCode } });
    if (!product) throw new BadRequestException('PRODUCT_NOT_FOUND');
    const providerSessionId = randomUUID();
    await this.prisma.checkoutSession.create({
      data: {
        providerSessionId,
        userId,
        productId: product.id,
        amountCents: product.amountCents,
        currency: product.currency,
        metadata: (metadata ?? undefined) as any,
      },
    });
    return {
      sessionId: providerSessionId,
      checkoutUrl: `https://pay.example/checkout/${providerSessionId}`,
      amountCents: product.amountCents,
      currency: product.currency,
    };
  }

  /** Idempotent PSP webhook handler (idempotency enforced by PaymentEvent.eventId @unique). */
  async webhook(
    provider: string,
    eventId: string,
    type: string,
    payload: { sessionId?: string; paymentId?: string; [k: string]: unknown },
  ): Promise<{ ok: true; duplicate?: true; idempotent?: true }> {
    try {
      await this.prisma.paymentEvent.create({
        data: { provider, eventId, type, payload: payload as any },
      });
    } catch {
      // Unique violation on eventId => already processed.
      return { ok: true, duplicate: true };
    }

    if (type !== 'payment_succeeded') return { ok: true };

    const providerSessionId = String(payload.sessionId ?? '');
    const paymentRef = String(payload.paymentId ?? '');
    const session = await this.prisma.checkoutSession.findUnique({ where: { providerSessionId } });
    if (!session) throw new BadRequestException('SESSION_NOT_FOUND');
    if (session.status === 'paid') return { ok: true, idempotent: true };

    await this.prisma.checkoutSession.update({ where: { id: session.id }, data: { status: 'paid' } });
    await this.prisma.order.create({
      data: {
        userId: session.userId,
        productId: session.productId,
        amountCents: session.amountCents,
        currency: session.currency,
        paymentRef,
      },
    });

    const product = await this.prisma.product.findUnique({ where: { id: session.productId } });
    if (product?.kind === 'plan') {
      await this.grantPlanEntitlement(session.userId, product.code, product.interval);
    } else if (product?.kind === 'booking') {
      const bookingId = (session.metadata as { bookingId?: unknown } | null)?.bookingId;
      if (bookingId !== undefined && bookingId !== null) {
        await this.prisma.domainEventOutbox.create({
          data: { type: 'BOOKING_PAYMENT_SUCCEEDED', data: { bookingId, paymentRef } as any },
        });
      }
    }
    return { ok: true };
  }

  /** Activate/renew a plan subscription and emit an entitlement event. */
  private async grantPlanEntitlement(userId: number, planCode: string, interval: string | null): Promise<void> {
    const now = new Date();
    const monthsToAdd = interval === 'year' ? 12 : 1;
    const end = new Date(Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth() + monthsToAdd, now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(),
    ));
    const externalId = String(userId);
    await this.prisma.subscription.upsert({
      where: { provider_externalId: { provider: 'internal', externalId } },
      update: { planId: planCode, status: 'active', startedAt: now, currentPeriodEnd: end },
      create: {
        provider: 'internal', externalId, userId: externalId,
        planId: planCode, status: 'active', startedAt: now, currentPeriodEnd: end,
      },
    });
    await this.prisma.domainEventOutbox.create({
      data: { type: 'ENTITLEMENT_GRANTED', data: { userId, planCode } as any },
    });
  }

  /** Change plan with simple proration: remaining value credits the new plan. */
  async changePlan(userId: number, newPlanCode: string): Promise<CheckoutResult & { creditCents: number; amountDueCents: number }> {
    const sub = await this.prisma.subscription.findUnique({
      where: { provider_externalId: { provider: 'internal', externalId: String(userId) } },
    });
    if (!sub || sub.status !== 'active' || !sub.planId) throw new BadRequestException('NO_ACTIVE_SUBSCRIPTION');
    const currentPlan = await this.prisma.product.findUnique({ where: { code: sub.planId } });
    const newPlan = await this.prisma.product.findUnique({ where: { code: newPlanCode } });
    if (!currentPlan || !newPlan) throw new BadRequestException('PLAN_NOT_FOUND');

    const now = new Date();
    const remaining = Math.max(0, (sub.currentPeriodEnd?.getTime() ?? now.getTime()) - now.getTime());
    const periodMs = 30 * 24 * 60 * 60 * 1000; // approx month
    const credit = Math.round(currentPlan.amountCents * (remaining / periodMs));
    const amountDue = Math.max(0, newPlan.amountCents - credit);
    const sess = await this.checkout(userId, newPlanCode, { changeFrom: currentPlan.code, credit });
    return { ...sess, creditCents: credit, amountDueCents: amountDue };
  }
}
