
import request from 'supertest';
import { app } from '../../src/main';

describe('Coach E2E', () => {
  it('should get coaches list', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `query { coaches { id name } }` });
    expect(res.body.data.coaches).toBeInstanceOf(Array);
  });
});
