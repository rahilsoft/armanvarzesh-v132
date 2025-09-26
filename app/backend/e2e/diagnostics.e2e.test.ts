import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import request from 'supertest';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import helmet from "helmet";

let pg: StartedTestContainer;
let redis: StartedTestContainer;

beforeAll(async () => {
  pg = await new GenericContainer('postgres:16-alpine')
    .withEnv('POSTGRES_PASSWORD','test')
    .withEnv('POSTGRES_USER','test')
    .withEnv('POSTGRES_DB','test')
    .withExposedPorts(5432).start();
  redis = await new GenericContainer('redis:7-alpine')
    .withExposedPorts(6379).start();
  process.env.DATABASE_URL = `postgres://test:test@localhost:${pg.getMappedPort(5432)}/test`;
  process.env.REDIS_URL = `redis://localhost:${redis.getMappedPort(6379)}`;
}, 180_000);

afterAll(async () => {
  await pg.stop();
  await redis.stop();
});

describe('Backend GraphQL diagnostics', () => {
  it('should report db and queue readiness', async () => {
    const app = await NestFactory.create(AppModule);
  app.use(helmet());
    await app.init();
    const server = app.getHttpServer();
    const res = await request(server)
      .post('/graphql')
      .send({ query: '{ diagnostics { db queue } }' });
    expect(res.status).toBe(200);
    expect(res.body.data.diagnostics.db).toBe(true);
    expect(res.body.data.diagnostics.queue).toBe(true);
    await app.close();
  }, 180_000);
});