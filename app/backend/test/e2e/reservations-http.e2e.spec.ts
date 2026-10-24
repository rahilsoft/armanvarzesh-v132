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
  async function newSlot() {
    hourOffset += 2;
    const start = new Date(Date.UTC(2031, 0, 1, 0, 0, 0) + hourOffset * 3_600_000 + Math.floor(Math.random() * 1e6) * 60_000);
    return prisma.slot.create({
      data: { coachId: 1, startUTC: start, endUTC: new Date(start.getTime() + 3_600_000) },
    });
  }

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

  it('GraphQL bookReservation and cancelReservation require a token and enforce ownership', async () => {
    const slot = await newSlot();
    const server = app.getHttpServer();
    const book = { query: 'mutation($i: CreateReservationInput!){ bookReservation(input:$i){ id userId slotId status } }', variables: { i: { coachId: '1', slotId: String(slot.id) } } };

    const anon = await request(server).post('/graphql').send(book);
    expect(anon.body.data?.bookReservation ?? null).toBeNull();
    expect(JSON.stringify(anon.body.errors)).toMatch(/missing authorization header|Unauthorized/i);
    expect(await prisma.reservation.count({ where: { resourceId: slot.id } })).toBe(0);

    const ok = await request(server).post('/graphql').set(auth(alice)).send(book);
    expect(ok.body.errors).toBeUndefined();
    expect(ok.body.data.bookReservation).toMatchObject({ userId: String(alice.id), slotId: String(slot.id), status: 'ACTIVE' });
    const id = ok.body.data.bookReservation.id;

    const cancel = (a: Actor) => request(server).post('/graphql').set(auth(a)).send({ query: 'mutation($id: String!){ cancelReservation(id:$id) }', variables: { id } });
    const foreign = await cancel(bob);
    expect(foreign.body.data?.cancelReservation ?? null).toBeNull();
    expect(await prisma.reservation.findUniqueOrThrow({ where: { id: Number(id) } })).toMatchObject({ status: 'ACTIVE' });
    const own = await cancel(alice);
    expect(own.body.errors).toBeUndefined();
    expect(own.body.data.cancelReservation).toBe(true);
    expect(await prisma.reservation.findUniqueOrThrow({ where: { id: Number(id) } })).toMatchObject({ status: 'CANCELED' });
  });
});
