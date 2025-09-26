import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app/backend/src/app.module';

describe('E2E: Auth → Workout Create → Notification', () => {
  let app: INestApplication;
  let jwtToken: string;
  let workoutId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register & login user', async () => {
    const email = `user_${Date.now()}@test.com`;
    const password = process.env.E2E_PASS!;

    // ثبت‌نام
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .expect(201);

    // ورود
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    expect(loginRes.body.access_token).toBeDefined();
    jwtToken = loginRes.body.access_token;
  });

  it('should create a workout', async () => {
    const res = await request(app.getHttpServer())
      .post('/workouts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        type: 'running',
        duration: 30,
        calories: 200,
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    workoutId = res.body.id;
  });

  it('should trigger a notification for workout', async () => {
    const res = await request(app.getHttpServer())
      .post('/notifications')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        userId: 'me',
        message: `Workout ${workoutId} created successfully!`,
      })
      .expect(201);

    expect(res.body.status).toBe('sent');
  });
});
