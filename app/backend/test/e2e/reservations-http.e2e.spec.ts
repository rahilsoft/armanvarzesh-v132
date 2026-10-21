import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ReservationsController } from '../../src/reservations/reservations.controller';
import { ReservationService } from '../../src/reservations/reservation.service';

describe('Reservations E2E (memory optimistic)', () => {
  let app: INestApplication;
  const savedMemoryDb = process.env.MEMORY_DB;
  beforeAll(async () => {
    process.env.MEMORY_DB = 'true';
    const moduleRef = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [ReservationService],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    // seed
    const svc = app.get(ReservationService);
    await svc.seedMemory();
  });

  afterAll(async () => {
    await app.close();
    if (savedMemoryDb === undefined) delete process.env.MEMORY_DB; else process.env.MEMORY_DB = savedMemoryDb;
  });

  it('reserves a slot and prevents double-booking', async () => {
    const r1 = await request(app.getHttpServer()).post('/reservations/reserve').send({ userId: 'u1', slotId: 'slot-1' });
    expect(r1.status).toBe(201);
    const r2 = await request(app.getHttpServer()).post('/reservations/reserve').send({ userId: 'u2', slotId: 'slot-1' });
    expect(r2.status).toBeGreaterThanOrEqual(400); // conflict expected
  });
});
