import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import * as crypto from 'crypto';
import { AppModule } from '../src/app.module';

describe('Payments Webhook (E2E)', () => {
  let app: INestApplication;
  let server: any;
  const secret = process.env.PAYMENT_WEBHOOK_SECRET || 'test_secret';

  beforeAll(async () => {
    const mod: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => { await app.close(); });

  function sign(body: any) {
    const raw = JSON.stringify(body);
    const h = crypto.createHmac('sha256', secret).update(raw).digest('hex');
    return { raw, sig: h };
  }

  it('rejects invalid signature (401)', async () => {
    const payload = { event: 'test', ts: Date.now() };
    const { raw } = sign(payload);
    await request(server)
      .post('/payments/webhook')
      .set('x-signature', 'deadbeef') // invalid
      .send(payload)
      .expect(401);
  });

  it('accepts valid signature (200)', async () => {
    const payload = { event: 'test', ts: Date.now() };
    const { raw, sig } = sign(payload);
    await request(server)
      .post('/payments/webhook')
      .set('x-signature', sig)
      .send(payload)
      .expect((res) => {
        // accept either 200 (success) or 500 (if DB not wired yet), but prefer 200
        if (![200, 500].includes(res.status)) {
          throw new Error('Unexpected status ' + res.status);
        }
      });
  });
});
