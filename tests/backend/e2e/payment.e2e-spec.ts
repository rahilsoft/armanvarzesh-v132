
import request from 'supertest';
import { app } from '../../src/main';

describe('Payment E2E', () => {
  it('should get payments', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `query { payments { id amount status } }` });
    expect(res.body.data.payments).toBeInstanceOf(Array);
  });
});
