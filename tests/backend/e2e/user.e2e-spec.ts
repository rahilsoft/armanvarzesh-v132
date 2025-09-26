
import request from 'supertest';
import { app } from '../../src/main';

describe('User E2E', () => {
  it('should create user', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `mutation { createUser(input: {email: "test@e2e.com", password: "1234"}) { id } }` });
    expect(res.body.data.createUser.id).toBeDefined();
  });
});
