import { GenericContainer, StartedTestContainer } from 'testcontainers';
import request from 'supertest';
import { createApp } from '@arman/service-kit';
import { createDbContext, dbPing, createQueueContext } from '@arman/integration';

let pg: StartedTestContainer;
let redis: StartedTestContainer;

beforeAll(async () => {
  // testcontainers v10 replaced the per-variable withEnv() with withEnvironment().
  pg = await new GenericContainer('postgres:16-alpine')
    .withEnvironment({
      POSTGRES_PASSWORD: 'test',
      POSTGRES_USER: 'test',
      POSTGRES_DB: 'test',
    })
    .withExposedPorts(5432).start();
  redis = await new GenericContainer('redis:7-alpine').withExposedPorts(6379).start();
}, 120_000);

afterAll(async () => {
  await pg.stop();
  await redis.stop();
});

describe('affiliate-service e2e (db+redis)', () => {
  it('diag should reflect db and queue readiness', async () => {
    const DATABASE_URL = `postgres://test:test@localhost:${pg.getMappedPort(5432)}/test`;
    const REDIS_URL = `redis://localhost:${redis.getMappedPort(6379)}`;
    const ctx = await createApp({ serviceName: 'affiliate-service' });

    const dbCtx = createDbContext({ ...process.env, DATABASE_URL });
    const qCtx = createQueueContext('affiliate-service', { ...process.env, REDIS_URL });

    const dbOk = await dbPing(dbCtx);
    expect(dbOk).toBe(true);
    expect(qCtx.ready).toBe(true);

    const res = await request(ctx.app).get('/health');
    expect(res.status).toBe(200);
  }, 180_000);
});
