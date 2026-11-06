import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../src/database/prisma.service';
import { createTestApp } from './utils/test-app';

/**
 * REV-20261022-01 regression: reserve/cancel require a verified JWT, the
 * booking user comes from the token (never the body), and only the owner or
 * an admin may cancel. Runs against real PostgreSQL.
 */
describe('Reservations (e2e, real PostgreSQL)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const savedMemoryDb = process.env.MEMORY_DB;
  const password = 'P@ssw0rd-e2e!';

  type Actor = { id: number; token: string };
  let alice: Actor;
  let bob: Actor;
  const extra: Actor[] = [];

  async function register(): Promise<Actor> {
    const email = `resv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
    const res = await request(app.getHttpServer()).post('/auth/register').send({ email, password }).expect(201);
    return { id: Number(res.body.user.id), token: res.body.accessToken };
  }

  const auth = (a: Actor) => ({ Authorization: `Bearer ${a.token}` });

  beforeAll(async () => {
    // The in-memory mode is a unit-test seam; this suite exercises the database path.
    delete process.env.MEMORY_DB;
    app = await createTestApp();
    prisma = app.get(PrismaService);
    alice = await register();
    bob = await register();
    for (let i = 0; i < 5; i++) extra.push(await register());
  });

  afterAll(async () => {
    await app.close();
    if (savedMemoryDb !== undefined) process.env.MEMORY_DB = savedMemoryDb;
  });

  let hourOffset = 0;
  async function newSlot(capacity = 1) {
    hourOffset += 2;
    const start = new Date(Date.UTC(2031, 0, 1, 0, 0, 0) + hourOffset * 3_600_000 + Math.floor(Math.random() * 1e6) * 60_000);
    return prisma.slot.create({
      data: { coachId: 1, startUTC: start, endUTC: new Date(start.getTime() + 3_600_000), capacity },
    });
  }

  async function seats(slotId: number) {
    const [bookings, reservations] = await Promise.all([
      prisma.booking.count({ where: { slotId, status: { in: ['PENDING', 'CONFIRMED'] } } }),
      prisma.reservation.count({ where: { resourceId: slotId, status: { not: 'CANCELED' } } }),
    ]);
    return { bookings, reservations, total: bookings + reservations };
  }

  const book = (a: Actor, slotId: number) =>
    request(app.getHttpServer()).post('/booking/create').set(auth(a)).send({ coachId: 1, slotId, mode: 'online' });
  const reserve = (a: Actor, slotId: number) =>
    request(app.getHttpServer()).post('/reservations/reserve').set(auth(a)).send({ slotId });

  it('rejects reserve and cancel without a token, and with an invalid token, with 401 and no DB change', async () => {
    const slot = await newSlot();
    const server = app.getHttpServer();
    const none = await request(server).post('/reservations/reserve').send({ slotId: slot.id });
    expect(none.status).toBe(401);
    const forged = jwt.sign({ sub: String(alice.id) }, 'not-the-server-secret-but-long-enough', { algorithm: 'HS256' });
    const bad = await request(server).post('/reservations/reserve').set('Authorization', `Bearer ${forged}`).send({ slotId: slot.id });
    expect(bad.status).toBe(401);
    expect(await prisma.reservation.count({ where: { resourceId: slot.id } })).toBe(0);

    const made = await request(server).post('/reservations/reserve').set(auth(alice)).send({ slotId: slot.id });
    expect(made.status).toBe(201);
    const id = Number(made.body.reservation.id);
    const anonCancel = await request(server).post('/reservations/cancel').send({ reservationId: id });
    expect(anonCancel.status).toBe(401);
    expect(await prisma.reservation.findUniqueOrThrow({ where: { id } })).toMatchObject({ status: 'ACTIVE', version: 1 });
  });

  it('books for the token user, and a userId in the body is rejected (no spoofing)', async () => {
    const slot = await newSlot();
    const server = app.getHttpServer();
    const spoof = await request(server).post('/reservations/reserve').set(auth(alice)).send({ userId: String(bob.id), slotId: slot.id });
    expect(spoof.status).toBe(400);
    expect(await prisma.reservation.count({ where: { resourceId: slot.id } })).toBe(0);

    const ok = await request(server).post('/reservations/reserve').set(auth(alice)).send({ slotId: slot.id });
    expect(ok.status).toBe(201);
    expect(ok.body).toMatchObject({ ok: true, reservation: { slotId: String(slot.id) } });
    const row = await prisma.reservation.findUniqueOrThrow({ where: { id: Number(ok.body.reservation.id) } });
    expect(row.userId).toBe(alice.id);
  });

  it('validates input: missing or non-numeric slotId is 400', async () => {
    const server = app.getHttpServer();
    expect((await request(server).post('/reservations/reserve').set(auth(alice)).send({})).status).toBe(400);
    expect((await request(server).post('/reservations/reserve').set(auth(alice)).send({ slotId: 'abc' })).status).toBe(400);
    expect((await request(server).post('/reservations/cancel').set(auth(alice)).send({ reservationId: -1 })).status).toBe(400);
    // beyond Postgres Int: must be a 400, not a Prisma overflow 500
    expect((await request(server).post('/reservations/reserve').set(auth(alice)).send({ slotId: 2147483648 })).status).toBe(400);
  });

  it('rejects a second booking of the same slot with 409', async () => {
    const slot = await newSlot();
    const server = app.getHttpServer();
    const first = await request(server).post('/reservations/reserve').set(auth(alice)).send({ slotId: slot.id });
    expect(first.status).toBe(201);
    const second = await request(server).post('/reservations/reserve').set(auth(bob)).send({ slotId: slot.id });
    expect(second.status).toBe(409);
    expect(await prisma.reservation.count({ where: { resourceId: slot.id } })).toBe(1);
  });

  it('under concurrent attempts by different users exactly one wins', async () => {
    const slot = await newSlot();
    const server = app.getHttpServer();
    const results = await Promise.all(
      extra.map((u) => request(server).post('/reservations/reserve').set(auth(u)).send({ slotId: slot.id })),
    );
    expect(results.filter((r) => r.status === 201)).toHaveLength(1);
    expect(results.filter((r) => r.status === 409)).toHaveLength(4);
    expect(await prisma.reservation.count({ where: { resourceId: slot.id } })).toBe(1);
  });

  it('user B cannot cancel user A’s reservation (404, row unchanged)', async () => {
    const slot = await newSlot();
    const server = app.getHttpServer();
    const made = await request(server).post('/reservations/reserve').set(auth(alice)).send({ slotId: slot.id });
    expect(made.status).toBe(201);
    const id = Number(made.body.reservation.id);

    const foreign = await request(server).post('/reservations/cancel').set(auth(bob)).send({ reservationId: id });
    expect(foreign.status).toBe(404);
    expect(await prisma.reservation.findUniqueOrThrow({ where: { id } })).toMatchObject({ status: 'ACTIVE', version: 1, userId: alice.id });
  });

  it('the owner can cancel, the version bumps, and a second cancel is 409', async () => {
    const slot = await newSlot();
    const server = app.getHttpServer();
    const made = await request(server).post('/reservations/reserve').set(auth(alice)).send({ slotId: slot.id });
    expect(made.status).toBe(201);
    const id = Number(made.body.reservation.id);

    const cancel = await request(server).post('/reservations/cancel').set(auth(alice)).send({ reservationId: id });
    expect(cancel.status).toBe(201);
    expect(cancel.body).toEqual({ ok: true, reservation: { id: String(id) } });
    expect(await prisma.reservation.findUniqueOrThrow({ where: { id } })).toMatchObject({ status: 'CANCELED', version: 2 });

    const again = await request(server).post('/reservations/cancel').set(auth(alice)).send({ reservationId: id });
    expect(again.status).toBe(409);
  });

  it('concurrent cancels by the owner: exactly one succeeds and the version moves once', async () => {
    const slot = await newSlot();
    const server = app.getHttpServer();
    const made = await request(server).post('/reservations/reserve').set(auth(alice)).send({ slotId: slot.id });
    expect(made.status).toBe(201);
    const id = Number(made.body.reservation.id);

    const results = await Promise.all(
      Array.from({ length: 5 }, () => request(server).post('/reservations/cancel').set(auth(alice)).send({ reservationId: id })),
    );
    expect(results.filter((r) => r.status === 201)).toHaveLength(1);
    expect(results.filter((r) => r.status === 409)).toHaveLength(4);
    expect(await prisma.reservation.findUniqueOrThrow({ where: { id } })).toMatchObject({ status: 'CANCELED', version: 2, userId: alice.id });
  });

  it('a cancelled slot can be booked again by another user, and the cancelled row is kept', async () => {
    const slot = await newSlot();
    const server = app.getHttpServer();
    const made = await request(server).post('/reservations/reserve').set(auth(alice)).send({ slotId: slot.id });
    expect(made.status).toBe(201);
    const firstId = Number(made.body.reservation.id);
    const cancel = await request(server).post('/reservations/cancel').set(auth(alice)).send({ reservationId: firstId });
    expect(cancel.status).toBe(201);

    const rebook = await request(server).post('/reservations/reserve').set(auth(bob)).send({ slotId: slot.id });
    expect(rebook.status).toBe(201);
    const secondId = Number(rebook.body.reservation.id);
    expect(secondId).not.toBe(firstId);

    // The rebooked slot is held again: a further active booking is still 409.
    const third = await request(server).post('/reservations/reserve').set(auth(alice)).send({ slotId: slot.id });
    expect(third.status).toBe(409);

    const rows = await prisma.reservation.findMany({ where: { resourceId: slot.id }, orderBy: { id: 'asc' } });
    expect(rows.map((r) => ({ id: r.id, userId: r.userId, status: r.status }))).toEqual([
      { id: firstId, userId: alice.id, status: 'CANCELED' },
      { id: secondId, userId: bob.id, status: 'ACTIVE' },
    ]);
  });

  it('after a cancel, concurrent rebook attempts still yield exactly one winner', async () => {
    const slot = await newSlot();
    const server = app.getHttpServer();
    const made = await request(server).post('/reservations/reserve').set(auth(alice)).send({ slotId: slot.id });
    expect(made.status).toBe(201);
    const cancel = await request(server).post('/reservations/cancel').set(auth(alice)).send({ reservationId: Number(made.body.reservation.id) });
    expect(cancel.status).toBe(201);

    const results = await Promise.all(
      extra.map((u) => request(server).post('/reservations/reserve').set(auth(u)).send({ slotId: slot.id })),
    );
    expect(results.filter((r) => r.status === 201)).toHaveLength(1);
    expect(results.filter((r) => r.status === 409)).toHaveLength(4);
    expect(await prisma.reservation.count({ where: { resourceId: slot.id, status: { not: 'CANCELED' } } })).toBe(1);
    expect(await prisma.reservation.count({ where: { resourceId: slot.id, status: 'CANCELED' } })).toBe(1);
  });

  it('an admin principal may cancel another user’s reservation', async () => {
    const slot = await newSlot();
    const server = app.getHttpServer();
    const made = await request(server).post('/reservations/reserve').set(auth(bob)).send({ slotId: slot.id });
    expect(made.status).toBe(201);
    const id = Number(made.body.reservation.id);
    const adminToken = jwt.sign({ sub: String(alice.id), role: 'admin' }, process.env.JWT_SECRET as string, { algorithm: 'HS256', expiresIn: '5m' });
    const res = await request(server).post('/reservations/cancel').set('Authorization', `Bearer ${adminToken}`).send({ reservationId: id });
    expect(res.status).toBe(201);
    expect(await prisma.reservation.findUniqueOrThrow({ where: { id } })).toMatchObject({ status: 'CANCELED', version: 2 });
  });

  // REV-20261106-02: Booking and Reservation share the seats of one Slot.
  describe('mixed Booking and Reservation entry points', () => {
    it('a Booking takes the seat: a Reservation on the same slot is 409 and writes nothing', async () => {
      const slot = await newSlot();
      expect((await book(alice, slot.id)).status).toBe(201);
      expect((await reserve(bob, slot.id)).status).toBe(409);
      expect(await seats(slot.id)).toEqual({ bookings: 1, reservations: 0, total: 1 });
    });

    it('a Reservation takes the seat: a Booking on the same slot is rejected and writes nothing', async () => {
      const slot = await newSlot();
      expect((await reserve(alice, slot.id)).status).toBe(201);
      const second = await book(bob, slot.id);
      expect(second.status).toBe(400);
      expect(second.body.message).toBe('SLOT_FULL');
      expect(await seats(slot.id)).toEqual({ bookings: 0, reservations: 1, total: 1 });
    });

    it('an active hold blocks a Reservation', async () => {
      const slot = await newSlot();
      expect((await request(app.getHttpServer()).post('/booking/hold').set(auth(alice)).send({ slotId: slot.id })).status).toBe(201);
      expect((await reserve(bob, slot.id)).status).toBe(409);
      expect((await seats(slot.id)).total).toBe(0);
    });

    it('capacity 2 admits one Booking and one Reservation, the third attempt on either path is rejected', async () => {
      const slot = await newSlot(2);
      expect((await book(alice, slot.id)).status).toBe(201);
      expect((await reserve(bob, slot.id)).status).toBe(201);
      expect([400, 409]).toContain((await book(extra[0], slot.id)).status);
      expect((await reserve(extra[1], slot.id)).status).toBe(409);
      expect(await seats(slot.id)).toEqual({ bookings: 1, reservations: 1, total: 2 });
    });

    it('concurrent mixed attempts on a capacity-1 slot yield exactly one seat in total', async () => {
      const slot = await newSlot();
      const results = await Promise.all(
        [alice, bob, ...extra].map((u, i) => (i % 2 === 0 ? book(u, slot.id) : reserve(u, slot.id))),
      );
      expect(results.filter((r) => r.status === 201)).toHaveLength(1);
      for (const r of results) expect([201, 400, 409]).toContain(r.status);
      expect((await seats(slot.id)).total).toBe(1);
    });
  });

  // GraphQL is not covered here on purpose: every resolver call currently
  // fails closed in the global ThrottlerGuard (no HTTP request in the GraphQL
  // context). Re-enabling GraphQL needs a default-deny JWT guard for all
  // resolvers first; that work owns the GraphQL reservation e2e.
});
