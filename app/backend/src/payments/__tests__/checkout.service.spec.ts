import { BadRequestException } from '@nestjs/common';
import { CheckoutService } from '../checkout.service';

/**
 * Payments fold: verifies the checkout -> webhook -> order -> subscription ->
 * entitlement flow ported from services/payments-service, including webhook
 * idempotency (PaymentEvent.eventId unique) and proration on plan change.
 * Prisma is an in-memory mock; integration/E2E against real Postgres run in CI.
 */
function makePrismaMock() {
  const products: any[] = [];
  const sessions: any[] = [];
  const events: any[] = [];
  const orders: any[] = [];
  const subs: any[] = [];
  const outbox: any[] = [];
  let seq = 1;

  const bySessionId = (sid: string) => sessions.find((s) => s.providerSessionId === sid);

  const mock: any = {
    _products: products, _sessions: sessions, _events: events,
    _orders: orders, _subs: subs, _outbox: outbox,
    // Interactive transaction: run the callback against this same mock (the
    // in-memory store has no real rollback, which is fine for these unit tests).
    $transaction: async (arg: any) => (Array.isArray(arg) ? Promise.all(arg) : arg(mock)),
    product: {
      upsert: async ({ where, create }: any) => {
        let p = products.find((x) => x.code === where.code);
        if (!p) { p = { id: seq++, currency: 'EUR', interval: null, ...create }; products.push(p); }
        return p;
      },
      findUnique: async ({ where }: any) =>
        products.find((p) => (where.code !== undefined ? p.code === where.code : p.id === where.id)) ?? null,
    },
    checkoutSession: {
      create: async ({ data }: any) => { const s = { id: seq++, status: 'open', ...data }; sessions.push(s); return s; },
      findUnique: async ({ where }: any) =>
        (where.providerSessionId ? bySessionId(where.providerSessionId) : sessions.find((s) => s.id === where.id)) ?? null,
      update: async ({ where, data }: any) => { const s = sessions.find((x) => x.id === where.id); Object.assign(s, data); return s; },
    },
    paymentEvent: {
      findUnique: async ({ where }: any) => events.find((e) => e.eventId === where.eventId) ?? null,
      create: async ({ data }: any) => {
        if (events.some((e) => e.eventId === data.eventId)) { const err: any = new Error('unique'); err.code = 'P2002'; throw err; }
        const e = { id: seq++, ...data }; events.push(e); return e;
      },
    },
    order: { create: async ({ data }: any) => { const o = { id: seq++, status: 'paid', ...data }; orders.push(o); return o; } },
    subscription: {
      findUnique: async ({ where }: any) => {
        const { provider, externalId } = where.provider_externalId;
        return subs.find((s) => s.provider === provider && s.externalId === externalId) ?? null;
      },
      upsert: async ({ where, update, create }: any) => {
        const { provider, externalId } = where.provider_externalId;
        let s = subs.find((x) => x.provider === provider && x.externalId === externalId);
        if (s) Object.assign(s, update); else { s = { id: seq++, ...create }; subs.push(s); }
        return s;
      },
    },
    domainEventOutbox: { create: async ({ data }: any) => { const e = { id: seq++, ...data }; outbox.push(e); return e; } },
  };
  return mock;
}

function make() {
  const prisma = makePrismaMock();
  const svc = new CheckoutService(prisma as any);
  return { prisma, svc };
}

describe('CheckoutService (Payments fold)', () => {
  it('seeds products and opens a checkout session for a known plan', async () => {
    const { prisma, svc } = make();
    await svc.seedProducts();
    const res = await svc.checkout(42, 'plan-pro');
    expect(res.sessionId).toBeTruthy();
    expect(res.amountCents).toBe(1990);
    expect(prisma._sessions).toHaveLength(1);
    expect(prisma._sessions[0].userId).toBe(42);
  });

  it('rejects checkout for an unknown product', async () => {
    const { svc } = make();
    await svc.seedProducts();
    await expect(svc.checkout(1, 'no-such-plan')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('processes a payment_succeeded webhook: session paid, order + subscription + entitlement created', async () => {
    const { prisma, svc } = make();
    await svc.seedProducts();
    const { sessionId } = await svc.checkout(7, 'plan-pro');
    const r = await svc.webhook('psp', 'evt-1', 'payment_succeeded', { sessionId, paymentId: 'pay-1' });
    expect(r.ok).toBe(true);
    expect(prisma._sessions[0].status).toBe('paid');
    expect(prisma._orders).toHaveLength(1);
    expect(prisma._orders[0].paymentRef).toBe('pay-1');
    expect(prisma._subs[0]).toMatchObject({ provider: 'internal', externalId: '7', planId: 'plan-pro', status: 'active' });
    expect(prisma._outbox.some((e: any) => e.type === 'ENTITLEMENT_GRANTED')).toBe(true);
  });

  it('is idempotent: a duplicate eventId is ignored', async () => {
    const { prisma, svc } = make();
    await svc.seedProducts();
    const { sessionId } = await svc.checkout(7, 'plan-pro');
    await svc.webhook('psp', 'evt-dup', 'payment_succeeded', { sessionId, paymentId: 'pay-1' });
    const second = await svc.webhook('psp', 'evt-dup', 'payment_succeeded', { sessionId, paymentId: 'pay-1' });
    expect(second.duplicate).toBe(true);
    expect(prisma._orders).toHaveLength(1); // not double-created
  });

  it('emits a booking outbox event (not a synchronous HTTP call) for booking products', async () => {
    const { prisma, svc } = make();
    await svc.seedProducts();
    // register a booking product
    prisma._products.push({ id: 999, code: 'book-1', kind: 'booking', name: 'Session', amountCents: 5000, currency: 'EUR', interval: null });
    const { sessionId } = await svc.checkout(3, 'book-1', { bookingId: 'bk-1' });
    await svc.webhook('psp', 'evt-b', 'payment_succeeded', { sessionId, paymentId: 'pay-b' });
    expect(prisma._outbox.some((e: any) => e.type === 'BOOKING_PAYMENT_SUCCEEDED' && e.data.bookingId === 'bk-1')).toBe(true);
  });

  it('changePlan applies proration credit for a remaining period', async () => {
    const { svc } = make();
    await svc.seedProducts();
    const { sessionId } = await svc.checkout(9, 'plan-basic');
    await svc.webhook('psp', 'evt-c', 'payment_succeeded', { sessionId, paymentId: 'pay-c' });
    const change = await svc.changePlan(9, 'plan-pro');
    expect(change.creditCents).toBeGreaterThan(0);
    expect(change.amountDueCents).toBeLessThanOrEqual(1990);
  });
});
