import * as crypto from 'crypto';
import { UnauthorizedException } from '@nestjs/common';
import { WebhookSignatureGuard } from '../../src/common/webhook/webhook-signature.guard';

const ctx = (headers: Record<string, string>, body: any = { a: 1 }): any => ({
  switchToHttp: () => ({ getRequest: () => ({ headers, body, rawBody: Buffer.from(JSON.stringify(body)) }) }),
});
const sign = (secret: string, body: any = { a: 1 }) =>
  'sha256=' + crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');

describe('WebhookSignatureGuard', () => {
  const saved = { s: process.env.PAYMENT_WEBHOOK_SECRET, n: process.env.NODE_ENV };
  afterEach(() => {
    if (saved.s === undefined) delete process.env.PAYMENT_WEBHOOK_SECRET;
    else process.env.PAYMENT_WEBHOOK_SECRET = saved.s;
    (process.env as any).NODE_ENV = saved.n;
  });
  const guard = new WebhookSignatureGuard();

  it('fails closed in production when secret is unset', () => {
    delete process.env.PAYMENT_WEBHOOK_SECRET;
    (process.env as any).NODE_ENV = 'production';
    expect(() => guard.canActivate(ctx({}))).toThrow(UnauthorizedException);
  });

  it('is permissive without secret outside production', () => {
    delete process.env.PAYMENT_WEBHOOK_SECRET;
    (process.env as any).NODE_ENV = 'test';
    expect(guard.canActivate(ctx({}))).toBe(true);
  });

  it('accepts a valid signature and rejects missing, wrong and truncated ones with 401', () => {
    process.env.PAYMENT_WEBHOOK_SECRET = 's3cret';
    expect(guard.canActivate(ctx({ 'x-signature': sign('s3cret') }))).toBe(true);
    expect(() => guard.canActivate(ctx({}))).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(ctx({ 'x-signature': sign('other') }))).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(ctx({ 'x-signature': 'sha256=ab' }))).toThrow(UnauthorizedException);
  });
});
