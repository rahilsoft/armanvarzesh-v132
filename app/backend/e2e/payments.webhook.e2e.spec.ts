import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as crypto from 'crypto';
import { PaymentsController } from '../src/payments/payments.controller';
import { PaymentsService } from '../src/payments/payments.service';
import { IdempotencyService } from '../src/common/idempotency/idempotency.service';
import { WebhookSignatureGuard } from '../src/common/webhook/webhook-signature.guard';

describe('Payments Webhook E2E', () => {
  let app: INestApplication;
  const secret = process.env.SECRET || "changeme";
  beforeAll(async () => {
    process.env.REDIS_URL = 'memory://local';
    process.env.PAYMENT_WEBHOOK_SECRET = secret;
    const moduleRef = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [PaymentsService, IdempotencyService, WebhookSignatureGuard],
    }).compile();
    app = moduleRef.createNestApplication();
    // inject rawBody support
    const bodyParser = require('body-parser');
    app.use(bodyParser.json({ verify: (req: any, res: any, buf: Buffer) => { req.rawBody = buf; } }));
    await app.init();
  });

  afterAll(async () => { await app.close(); });

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
