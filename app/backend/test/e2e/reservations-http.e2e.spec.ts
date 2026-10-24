import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../src/database/prisma.service';
import { createTestApp } from './utils/test-app';

describe('Reservations (e2e, real PostgreSQL)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const savedMemoryDb = process.env.MEMORY_DB;

  beforeAll(async () => {
    // The in-memory mode is a unit-test seam; this suite exercises the database path.
    delete process.env.MEMORY_DB;
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
    if (savedMemoryDb !== undefined) process.env.MEMORY_DB = savedMemoryDb;
  });

  async function newSlot(offsetHours: number) {
    const start = new Date(Date.UTC(2031, 0, 1, offsetHours, 0, 0));
    return prisma.slot.create({
      data: { coachId: 1, startUTC: start, endUTC: new Date(start.getTime() + 3_600_000) },
    });
  }

  it('reserves a slot, persists it, and rejects a second booking of the same slot with 409', async () => {
    const slot = await newSlot(1);
    const server = app.getHttpServer();
    const first = await request(server).post('/reservations/reserve').send({ userId: '1', slotId: String(slot.id) });
    expect(first.status).toBe(201);
    expect(await prisma.reservation.count({ where: { resourceId: slot.id, status: 'ACTIVE' } })).toBe(1);

    const second = await request(server).post('/reservations/reserve').send({ userId: '2', slotId: String(slot.id) });
    expect(second.status).toBe(409);
    expect(await prisma.reservation.count({ where: { resourceId: slot.id } })).toBe(1);
  });

  it('under concurrent attempts exactly one wins', async () => {
    const slot = await newSlot(3);
    const server = app.getHttpServer();
    const results = await Promise.all(
      [1, 2, 3, 4, 5].map((u) =>
        request(server).post('/reservations/reserve').send({ userId: String(u), slotId: String(slot.id) }),
      ),
    );
    expect(results.filter((r) => r.status === 201)).toHaveLength(1);
    expect(results.filter((r) => r.status === 409)).toHaveLength(4);
    expect(await prisma.reservation.count({ where: { resourceId: slot.id } })).toBe(1);
  });

  it('cancel bumps the version and a second cancel is a 409', async () => {
    const slot = await newSlot(5);
    const server = app.getHttpServer();
    const made = await request(server).post('/reservations/reserve').send({ userId: '1', slotId: String(slot.id) });
    expect(made.status).toBe(201);
    const id = made.body.reservation.id;
    await request(server).post('/reservations/cancel').send({ reservationId: id }).expect(201);
    const row = await prisma.reservation.findUniqueOrThrow({ where: { id: Number(id) } });
    expect(row).toMatchObject({ status: 'CANCELED', version: 2 });
    const again = await request(server).post('/reservations/cancel').send({ reservationId: id });
    expect(again.status).toBe(409);
  });
});
