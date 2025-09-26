
import request from 'supertest';
import { app } from '../../src/main';

describe('Nutrition E2E', () => {
  it('should get nutrition plans', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `query { nutritionPlans { id title } }` });
    expect(res.body.data.nutritionPlans).toBeInstanceOf(Array);
  });
});
