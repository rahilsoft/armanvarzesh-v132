import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { PrismaService } from '../../database/prisma.service';

type StripeEvent = { id: string; type: string; data: any };
type RCEvent = { id: string; type: string; data: any };

@Processor('billing')
@Injectable()
export class BillingProcessor extends WorkerHost {
  private readonly logger = new Logger(BillingProcessor.name);
  constructor(private prisma: PrismaService) { super(); }

  async process(job: Job<any, any, string>): Promise<void> {
    if (job.name === 'stripe_event') return this.handleStripe(job.data as StripeEvent);
    if (job.name === 'revenuecat_event') return this.handleRevenueCat(job.data as RCEvent);
    if (job.name === 'reconcile') return this.reconcile();
  }

  private async handleStripe(evt: StripeEvent) {
    this.logger.log(`stripe event ${evt.type}`);
    switch (evt.type) {
      case 'checkout.session.completed': {
        const pi = evt.data?.object?.payment_intent;
        const amount = evt.data?.object?.amount_total || 0;
        const currency = (evt.data?.object?.currency || 'eur').toUpperCase();
        const userId = evt.data?.object?.client_reference_id || 'unknown';
        await this.prisma.payment.upsert({
          where: { intentId: pi ?? 'none' },
          update: { status: 'succeeded' as any, amountCents: amount, currency },
          create: { userId, provider: 'stripe' as any, status: 'succeeded' as any, intentId: pi ?? null, amountCents: amount, currency }
        });
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = evt.data?.object?.id;
        await this.prisma.payment.updateMany({ where: { intentId: pi }, data: { status: 'failed' as any } });
        break;
      }
      case 'charge.refunded': {
        const charge = evt.data?.object;
        const pi = charge?.payment_intent;
        const amount = charge?.amount_refunded || 0;
        const refundId = charge?.refunds?.data?.[0]?.id || null;
        const pay = await this.prisma.payment.findFirst({ where: { intentId: pi } });
        if (pay) {
          await this.prisma.refund.create({ data: { paymentId: pay.id, amountCents: amount, providerRefundId: refundId } });
          await this.prisma.payment.update({ where: { id: pay.id }, data: { status: 'refunded' as any } });
        }
        break;
      }
      default:
        // noop
        break;
    }
    await this.prisma.webhookEvent.updateMany({ where: { eventId: evt.id }, data: { processedAt: new Date(), success: true } });
  }

  private async handleRevenueCat(evt: RCEvent) {
    this.logger.log(`revenuecat event ${evt.type}`);
    const userId = evt.data?.app_user_id || 'unknown';
    const extId = evt.data?.subscriber_id || evt.data?.entitlement_id || null;
    const status = (evt.type && evt.type.includes('EXPIRATION')) ? 'canceled' : 'active';
    await this.prisma.subscription.upsert({
      where: { provider_externalId: { provider: 'revenuecat' as any, externalId: extId ?? userId } },
      update: { status: status as any, currentPeriodEnd: evt.data?.expiration_at_ms ? new Date(Number(evt.data.expiration_at_ms)) : null },
      create: { userId, provider: 'revenuecat' as any, externalId: extId ?? userId, status: status as any, currentPeriodEnd: evt.data?.expiration_at_ms ? new Date(Number(evt.data.expiration_at_ms)) : null }
    });
    await this.prisma.webhookEvent.updateMany({ where: { eventId: evt.id }, data: { processedAt: new Date(), success: true } });
  }

  // Daily reconciliation skeleton
  private async reconcile() {
    this.logger.log('running billing reconcile (skeleton)');
    // TODO: compare Payment records against provider reports and fix drifts
  }
}
