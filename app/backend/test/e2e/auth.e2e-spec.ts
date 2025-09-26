import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Auth flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('register -> login -> access protected resource', async () => {
    const email = `user${Date.now()}@test.com`;
    const password = 'P@ssw0rd!';
    await request(app.getHttpServer()).post('/graphql').send({
      query: 'mutation($input:RegisterInput!){ register(input:$input) }',
      variables: { input: { email, password } }
    }).expect(200);

    const loginRes = await request(app.getHttpServer()).post('/graphql').send({
      query: 'mutation($input:LoginInput!){ login(input:$input) }',
      variables: { input: { email, password } }
    }).expect(200);

    const token = loginRes.body?.data?.login;
    expect(token).toBeTruthy();

    const meRes = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: '{ me { id email } }' });

    expect(meRes.status).toBe(200);
  });
});