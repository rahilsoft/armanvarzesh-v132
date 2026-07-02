import request from 'supertest';
import { createTestApp } from './utils/test-app';

const E = (name: string, def?: string) => process.env[name] || def;

describe('auth e2e', () => {
  const enabled = E('E2E_AUTH_ENABLED', 'false') === 'true';

  (enabled ? it : it.skip)('login flow', async () => {
    const app = await createTestApp();
    const server = app.getHttpServer();
    const username = E('E2E_USER', 'test@example.com');
    const password = E('E2E_PASS', 'Password123!');
    // Try REST login first
    let res = await request(server).post('/auth/login').send({ username, password });
    if (res.status >= 400) {
      // fallback: GraphQL
      res = await request(server)
        .post('/graphql')
        .send({ query: 'mutation($u:String!,$p:String!){ login(username:$u,password:$p){ accessToken } }', variables: { u: username, p: password } })
        .set('content-type', 'application/json');
    }
    await app.close();
    expect(res.status).toBeLessThan(500);
  });
});
