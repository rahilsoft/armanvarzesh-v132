
import request from 'supertest';
import { app } from '../../src/main';

describe('Auth E2E', () => {
  it('should register and login', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `mutation { register(input: {email: "e2e@user.com", password: "e2epass"}) { token } }` });
    expect(res.body.data.register.token).toBeDefined();
  });
});
