import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

function uid(): string { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8); return v.toString(16);
});}

function cents(n:number){ return Math.round(n); } // enforce integer

@Injectable()
export class PaymentsService {
  prisma = new PrismaClient();
  BOOKING_URL = process.env.BOOKING_URL || 'http://localhost:4069';

  async seedProducts(){
    const plans = [
      { id:'plan-basic', kind:'plan', name:'Basic Monthly', amountCents: 990, currency:'EUR', interval:'month' },
      { id:'plan-pro',   kind:'plan', name:'Pro Monthly',   amountCents: 1990, currency:'EUR', interval:'month' }
    ];
    for (const p of plans){
      await this.prisma.product.upsert({ where:{ id:p.id }, update:{}, create:p as any });
    }
  }

  async checkout(userId: string, productId: string, metadata?: any){
    const prod = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!prod) throw new BadRequestException('PRODUCT_NOT_FOUND');
    const id = uid();
    const sess = await this.prisma.checkoutSession.create({ data: { id, userId, productId, amountCents: prod.amountCents, currency: prod.currency, metadata } });
    const checkoutUrl = `https://pay.example/checkout/${id}`;
    return { sessionId: id, checkoutUrl, amountCents: prod.amountCents, currency: prod.currency };
  }

  // Simulated webhook from PSP
  async webhook(provider: string, eventId: string, type: string, payload: any){
    // idempotency via eventId unique
    try {
      await this.prisma.paymentEvent.create({ data: { id: uid(), provider, eventId, type, sessionId: payload?.sessionId||null, payload } });
    } catch {
      return { ok: true, duplicate: true };
    }
    if (type === 'payment_succeeded'){
      const sessionId = payload.sessionId as string;
      const paymentId = payload.paymentId as string;
      const sess = await this.prisma.checkoutSession.findUnique({ where: { id: sessionId } });
      if (!sess) throw new BadRequestException('SESSION_NOT_FOUND');
      if (sess.status === 'paid') return { ok: true, idempotent: true };
      await this.prisma.checkoutSession.update({ where: { id: sessionId }, data: { status: 'paid' } });
      // create order
      await this.prisma.order.create({ data: { id: uid(), userId: sess.userId, productId: sess.productId, amountCents: sess.amountCents, currency: sess.currency, paymentId } });

      const prod = await this.prisma.product.findUnique({ where: { id: sess.productId } });
      if (prod?.kind === 'plan'){
        const now = new Date();
        const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth()+ (prod.interval==='year'?12:1), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        await this.prisma.subscription.upsert({
          where: { userId: sess.userId }, update: { planId: prod.id, status:'active', startedAt: now, currentPeriodEnd: end },
          create: { id: uid(), userId: sess.userId, planId: prod.id, status:'active', startedAt: now, currentPeriodEnd: end }
        });
        // emit ENTITLEMENT_GRANTED
        await this.prisma.domainEventOutbox.create({ data: { id: uid(), type: 'ENTITLEMENT_GRANTED', data: { userId: sess.userId, roles: ['Pro'] } as any } });
      } else if (prod?.kind === 'booking'){
        // notify booking-service to confirm
        const bookingId = (sess.metadata as any)?.bookingId;
        if (bookingId){
          try {
            await fetch(`${this.BOOKING_URL}/booking/payments/success`, { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ bookingId, paymentId }) });
          } catch {}
        }
      }
    }
    return { ok: true };
  }

  // Plan change with simple proration (remaining value as credit against new plan)
  async changePlan(userId: string, newPlanId: string){
    const sub = await this.prisma.subscription.findFirst({ where: { userId, status: 'active' } });
    if (!sub) throw new BadRequestException('NO_ACTIVE_SUBSCRIPTION');
    const currentPlan = await this.prisma.product.findUnique({ where: { id: sub.planId } });
    const newPlan = await this.prisma.product.findUnique({ where: { id: newPlanId } });
    if (!currentPlan || !newPlan) throw new BadRequestException('PLAN_NOT_FOUND');

    const now = new Date();
    const remaining = Math.max(0, sub.currentPeriodEnd.getTime() - now.getTime());
    const periodMs = 30 * 24 * 60 * 60 * 1000; // approx month
    const credit = Math.round(currentPlan.amountCents * (remaining / periodMs));
    const amountDue = Math.max(0, newPlan.amountCents - credit);
    // create new session for delta
    const sess = await this.checkout(userId, newPlanId, { changeFrom: currentPlan.id, credit });
    return { ...sess, creditCents: credit, amountDueCents: amountDue };
  }
}
