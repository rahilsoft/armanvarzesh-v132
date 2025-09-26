import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Notifications E2E: create → list (GraphQL)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a notification and can list it', async () => {
    const userId = 1;
    const message = 'Workout created successfully';
    const createMutation = `
      mutation Create($userId: Int!, $message: String!, $priority: String) {
        createNotification(userId: $userId, message: $message, priority: $priority) {
          id userId message priority read
        }
      }
    `;
    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createMutation, variables: { userId, message, priority: 'normal' } })
      .expect(200);
    const created = createRes.body?.data?.createNotification;
    expect(created?.id).toBeDefined();
    expect(created?.userId).toBe(userId);
    expect(created?.message).toBe(message);

    const listQuery = `
      query List($userId: Int!) {
        notifications(userId: $userId) { id userId message read }
      }
    `;
    const listRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: listQuery, variables: { userId } })
      .expect(200);
    const list = listRes.body?.data?.notifications;
    expect(Array.isArray(list)).toBe(true);
    expect(list.find((n:any) => n.id === created.id)).toBeTruthy();
  });
});
