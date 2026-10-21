import { Test } from '@nestjs/testing';
import bodyParser from 'body-parser';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as crypto from 'crypto';
import { PaymentsController } from '../../src/payments/payments.controller';
import { PaymentsService } from '../../src/payments/payments.service';
import { IdempotencyService } from '../../src/common/idempotency/idempotency.service';
import { WebhookSignatureGuard } from '../../src/common/webhook/webhook-signature.guard';

describe('Payments Webhook E2E', () => {
  let app: INestApplication;
  const secret = process.env.SECRET || "changeme";
  // process.env is shared by every spec file under --runInBand: restore it so
  // 'memory://local' never reaches specs that boot AppModule (BullMQ/ioredis).
  const saved = { REDIS_URL: process.env.REDIS_URL, PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET };
  const restore = (k: keyof typeof saved) => { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; };
  beforeAll(async () => {
    process.env.REDIS_URL = 'memory://local';
    process.env.PAYMENT_WEBHOOK_SECRET = secret;
    const moduleRef = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [PaymentsService, IdempotencyService, WebhookSignatureGuard],
    }).compile();
    app = moduleRef.createNestApplication();
    // inject rawBody support

    app.use(bodyParser.json({ verify: (req: any, res: any, buf: Buffer) => { req.rawBody = buf; } }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    restore('REDIS_URL');
    restore('PAYMENT_WEBHOOK_SECRET');
  });

  it('accepts signed webhook and replays on same Idempotency-Key', async () => {
    const body = JSON.stringify({ status: 'OK', Authority: 'A-1' });
    const sig = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
    const call = () => request(app.getHttpServer())
      .post('/payments/webhook')
      .set('Content-Type', 'application/json')
      .set('x-signature', sig)
      .set('Idempotency-Key', 'e2e-1')
      .send(body);
    const r1 = await call();
    expect(r1.status).toBeLessThan(400);
    const r2 = await call();
    expect(r2.status).toBeLessThan(400); // replay returns 200 with same payload
    expect(r2.body.reference).toBeDefined();
  });
});
