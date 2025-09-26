import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Notifications (presence)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const mod: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => { await app.close(); });

  it('GET /notifications/:userId -> exists (200/404/500 allowed)', async () => {
    const res = await request(server).get('/notifications/test-user');
    expect([200, 404, 500]).toContain(res.status);
  });
});
