
import request from 'supertest';
import { app } from '../../src/main';

describe('Workout E2E', () => {
  it('should create workout', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `mutation { createWorkout(input: {title: "E2E Workout", duration: 40}) { id } }` });
    expect(res.body.data.createWorkout.id).toBeDefined();
  });
});
