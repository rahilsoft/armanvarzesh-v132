import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App E2E (bootstrap & 404)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => { await app.close(); });

  it('boots the Nest app', async () => {
    expect(app).toBeDefined();
  });

  it('responds to HTTP with a 404 for unknown route (server is alive)', async () => {
    await request(server).get('/__not_found__').expect(404);
  });
});
