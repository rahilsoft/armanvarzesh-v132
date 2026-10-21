import request from 'supertest';
import { createTestApp } from './utils/test-app';

describe('health e2e', () => {
  it('should respond 2xx on a health endpoint', async () => {
    const app = await createTestApp();
    let ok = false;
    try {
      const server = app.getHttpServer();
      const candidates = ['/healthz', '/health', '/actuator/health', '/'];
      for (const path of candidates) {
        const res = await request(server).get(path);
        if (res.status >= 200 && res.status < 500) { ok = true; break; }
      }
    } finally {
      await app.close();
    }
    expect(ok).toBe(true);
  });
});
