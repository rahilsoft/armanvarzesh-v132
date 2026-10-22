import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './utils/test-app';

describe('Auth flow (e2e, real PostgreSQL)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  const password = 'P@ssw0rd-e2e!';
  const uniqueEmail = () => `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

  it('registers, logs in, refreshes with rotation and rejects a replayed refresh token', async () => {
    const email = uniqueEmail();
    const server = app.getHttpServer();

    const reg = await request(server).post('/auth/register').send({ email, password }).expect(201);
    expect(reg.body.accessToken).toEqual(expect.any(String));
    expect(reg.body.refreshToken).toMatch(/^.+\..+$/);
    expect(reg.body.user.email).toBe(email);

    const login = await request(server).post('/auth/login').send({ email, password }).expect(200);
    expect(login.body.user.id).toBe(reg.body.user.id);

    const refreshed = await request(server).post('/auth/refresh').send({ refreshToken: login.body.refreshToken }).expect(200);
    expect(refreshed.body.accessToken).toEqual(expect.any(String));
    expect(refreshed.body.refreshToken).not.toBe(login.body.refreshToken);

    // the rotated-out token must be dead
    await request(server).post('/auth/refresh').send({ refreshToken: login.body.refreshToken }).expect(401);
  });

  it('rejects a duplicate registration', async () => {
    const email = uniqueEmail();
    const server = app.getHttpServer();
    await request(server).post('/auth/register').send({ email, password }).expect(201);
    const dup = await request(server).post('/auth/register').send({ email, password });
    expect(dup.status).toBe(409);
  });

  it('rejects a wrong password and an unknown account with the same 401', async () => {
    const email = uniqueEmail();
    const server = app.getHttpServer();
    await request(server).post('/auth/register').send({ email, password }).expect(201);
    const wrong = await request(server).post('/auth/login').send({ email, password: 'not-the-password' });
    const unknown = await request(server).post('/auth/login').send({ email: uniqueEmail(), password });
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(unknown.body.message).toBe(wrong.body.message);
  });

  it('validates input: malformed email and short password are 400', async () => {
    const server = app.getHttpServer();
    await request(server).post('/auth/register').send({ email: 'nope', password }).expect(400);
    await request(server).post('/auth/register').send({ email: uniqueEmail(), password: 'short' }).expect(400);
  });

  it('guards a protected route: no token, garbage token and a real token', async () => {
    const server = app.getHttpServer();
    await request(server).get('/payments').expect(401);
    await request(server).get('/payments').set('Authorization', 'Bearer not.a.jwt').expect(401);

    const reg = await request(server).post('/auth/register').send({ email: uniqueEmail(), password }).expect(201);
    const mine = await request(server).get('/payments').set('Authorization', `Bearer ${reg.body.accessToken}`).expect(200);
    expect(mine.body).toMatchObject({ ok: true, data: [] });
  });
});
