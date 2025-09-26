
import request from 'supertest';
import { app } from '../../src/main';

describe('Notification E2E', () => {
  it('should get notifications', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `query { notifications { id text } }` });
    expect(res.body.data.notifications).toBeInstanceOf(Array);
  });
});
