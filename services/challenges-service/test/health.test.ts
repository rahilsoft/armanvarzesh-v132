import request from 'supertest';
import { createApp } from '@arman/service-kit';
import { describe, it, expect } from 'vitest';

describe('challenges-service service', () => {
  it('health should be ok', async () => {
    const ctx = await createApp({ serviceName: 'challenges-service' });
    const res = await request(ctx.app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
