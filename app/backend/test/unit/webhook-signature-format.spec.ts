import { UnauthorizedException } from '@nestjs/common';
import { computeWebhookSignature, verifyWebhookSignature } from '../../src/common/security/webhook-signature';

const SECRET = 's'.repeat(40);
const body = { orderId: 'o-1', amount: 1000 };
const sig = computeWebhookSignature(SECRET, body);
const run = (signature: string) => () => verifyWebhookSignature('t', { ...body, signature }, SECRET);

describe('webhook signature format', () => {
  it('accepts valid', () => expect(run(sig)).not.toThrow());
  it.each([
    ['extra hex char', sig + 'f'],
    ['non-hex tail', sig + 'zz'],
    ['uppercase', sig.toUpperCase()],
  ])('rejects %s', (_n, v) => expect(run(v)).toThrow(UnauthorizedException));
});
