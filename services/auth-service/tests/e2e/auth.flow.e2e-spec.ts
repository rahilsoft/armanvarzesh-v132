import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Auth E2E: register → login (GraphQL)', () => {
  let app: INestApplication;
  const email = `e2e_${Date.now()}@test.dev`;
  const password = process.env.E2E_PASS!;
  const name = 'E2E User';

  beforeAll(async () => {
    // Ensure test DB URL is set (falls back to localhost compose)
    process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/armanfit_auth?schema=public';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e_secret';
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a user', async () => {
    const mutation = `
      mutation Register($input: RegisterInput!) {
        register(input: $input) { id email }
      }
    `;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation,
        variables: { input: { email, password, name } },
      })
      .expect(200);
    expect(res.body?.data?.register?.email).toBe(email);
    expect(res.body.errors).toBeUndefined();
  });

  it('logs in and returns tokens', async () => {
    const mutation = `
      mutation Login($input: LoginInput!) {
        login(input: $input) { accessToken refreshToken }
      }
    `;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation,
        variables: { input: { email, password } },
      })
      .expect(200);
    const tokens = res.body?.data?.login;
    expect(tokens?.accessToken).toBeTruthy();
    expect(tokens?.refreshToken).toBeTruthy();
    expect(res.body.errors).toBeUndefined();
  });
});
