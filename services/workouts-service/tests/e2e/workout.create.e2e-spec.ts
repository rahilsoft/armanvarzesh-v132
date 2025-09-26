import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Workouts E2E: create workout (REST)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/armanfit_workouts?schema=public';
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a workout', async () => {
    const dto = {
      userId: '1',
      title: 'E2E Workout',
      level: 'beginner',
      goal: 'strength',
      equipment: ['dumbbell','barbell']
    };
    const res = await request(app.getHttpServer())
      .post('/workouts')
      .send(dto)
      .expect(201);
    expect(res.body?.id).toBeDefined();
    expect(res.body?.title).toBe(dto.title);
  });
});
