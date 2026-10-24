import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../src/database/prisma.service';
import { computeWebhookSignature } from '../../src/common/security/webhook-signature';
import { createTestApp } from './utils/test-app';

const SECRET = 'e2e-checkout-webhook-secret-0123456789';
// Event ids are unique per run so a re-run against the same database stays independent.
const RUN = `${Date.now()}`;

describe('Checkout webhook (e2e, real PostgreSQL)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userId: number;
  const savedSecret = process.env.PAYMENTS_WEBHOOK_SECRET;

  beforeAll(async () => {
    process.env.PAYMENTS_WEBHOOK_SECRET = SECRET;
    app = await createTestApp();
    prisma = app.get(PrismaService);
    const reg = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: `wh-${Date.now()}@example.com`, password: 'P@ssw0rd-e2e!' })
      .expect(201);
    userId = reg.body.user.id;
    await prisma.product.upsert({
      where: { code: 'plan-e2e' },
      update: {},
      create: { code: 'plan-e2e', kind: 'plan', name: 'E2E plan', amountCents: 1990, currency: 'EUR', interval: 'month' },
    });
  });

  afterAll(async () => {
    await app.close();
    if (savedSecret === undefined) delete process.env.PAYMENTS_WEBHOOK_SECRET;
    else process.env.PAYMENTS_WEBHOOK_SECRET = savedSecret;
  });

  async function openSession(): Promise<string> {
    const product = await prisma.product.findUniqueOrThrow({ where: { code: 'plan-e2e' } });
    const providerSessionId = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await prisma.checkoutSession.create({
      data: { providerSessionId, userId, productId: product.id, amountCents: product.amountCents, currency: product.currency },
    });
    return providerSessionId;
  }

  function signed(eventId: string, sessionId: string, tamper = false) {
    const body: Record<string, unknown> = {
      provider: 'e2e',
      eventId,
      type: 'payment_succeeded',
      payload: { sessionId, paymentId: `pay-${eventId}` },
    };
    body.signature = computeWebhookSignature(SECRET, body);
    if (tamper) body.eventId = `${eventId}-tampered`;
    return body;
  }

  it('rejects a missing and a forged signature without changing any state', async () => {
    const server = app.getHttpServer();
    const sessionId = await openSession();
    const unsigned = signed(`ev-unsigned-${RUN}`, sessionId);
    delete unsigned.signature;
    await request(server).post('/payments/checkout/webhook').send(unsigned).expect(400);
    await request(server).post('/payments/checkout/webhook').send(signed(`ev-forged-${RUN}`, sessionId, true)).expect(401);

    const session = await prisma.checkoutSession.findUniqueOrThrow({ where: { providerSessionId: sessionId } });
    expect(session.status).toBe('open');
    expect(await prisma.order.count({ where: { userId } })).toBe(0);
  });

  it('a signed payment_succeeded creates exactly one order and an active subscription, and replays are no-ops', async () => {
    const server = app.getHttpServer();
    const sessionId = await openSession();
    const body = signed(`ev-paid-${RUN}`, sessionId);

    await request(server).post('/payments/checkout/webhook').send(body).expect(201);
    // redelivery of the same event id
    const replay = await request(server).post('/payments/checkout/webhook').send(body).expect(201);
    expect(replay.body).toMatchObject({ ok: true, duplicate: true });

    const session = await prisma.checkoutSession.findUniqueOrThrow({ where: { providerSessionId: sessionId } });
    expect(session.status).toBe('paid');
    expect(await prisma.order.count({ where: { userId, paymentRef: `pay-ev-paid-${RUN}` } })).toBe(1);
    const sub = await prisma.subscription.findUniqueOrThrow({
      where: { provider_externalId: { provider: 'internal', externalId: String(userId) } },
    });
    expect(sub).toMatchObject({ status: 'active', planId: 'plan-e2e' });
    expect(sub.currentPeriodEnd!.getTime()).toBeGreaterThan(Date.now());
  });

  it('concurrent deliveries of one event still create exactly one order', async () => {
    const server = app.getHttpServer();
    const sessionId = await openSession();
    const body = signed(`ev-race-${RUN}`, sessionId);
    const results = await Promise.all(
      Array.from({ length: 4 }, () => request(server).post('/payments/checkout/webhook').send(body)),
    );
    // Every delivery is accepted with 201 (a 4xx would make the PSP retry or
    // give up). Exactly one applies the event, every other one reports it as a
    // duplicate. (REV-20261021-03: no `< 500` catch-all.)
    for (const r of results) expect(r.status).toBe(201);
    const applied = results.filter((r) => r.body.ok === true && r.body.duplicate === undefined && r.body.idempotent === undefined);
    const dupes = results.filter((r) => r.body.ok === true && r.body.duplicate === true);
    expect(applied).toHaveLength(1);
    expect(applied[0].body).toEqual({ ok: true });
    expect(dupes).toHaveLength(results.length - 1);
    for (const d of dupes) expect(d.body).toEqual({ ok: true, duplicate: true });

    expect(await prisma.paymentEvent.count({ where: { eventId: `ev-race-${RUN}` } })).toBe(1);
    expect(await prisma.order.count({ where: { paymentRef: `pay-ev-race-${RUN}` } })).toBe(1);
    const session = await prisma.checkoutSession.findUniqueOrThrow({ where: { providerSessionId: sessionId } });
    expect(session.status).toBe('paid');
    const sub = await prisma.subscription.findUniqueOrThrow({
      where: { provider_externalId: { provider: 'internal', externalId: String(userId) } },
    });
    expect(sub).toMatchObject({ status: 'active', planId: 'plan-e2e' });
    expect(sub.currentPeriodEnd!.getTime()).toBeGreaterThan(Date.now());
  });
});
