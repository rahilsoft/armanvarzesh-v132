import { createHmac, timingSafeEqual } from 'crypto';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

/**
 * Verify an inbound PSP webhook before any state change (P0-4). The callback is
 * authenticated by an HMAC-SHA256 signature (hex, `x-signature` header) over the
 * canonical JSON body using PAYMENTS_WEBHOOK_SECRET. Comparison is constant-time.
 * In production a missing secret is a hard failure (fail-closed); outside
 * production verification is skipped so local/test flows work.
 */
export function verifyWebhookSignature(req: any, body: unknown): void {
  const secret = process.env.PAYMENTS_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('payments webhook secret is not configured');
    }
    return; // dev/test: verification disabled
  }
  const provided = (req?.headers?.['x-signature'] || '').toString();
  if (!provided) throw new BadRequestException('payments webhook signature missing');
  const expected = createHmac('sha256', secret).update(stableStringify(body)).digest('hex');
  const a = Buffer.from(provided, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new UnauthorizedException('payments webhook signature invalid');
  }
}

/** Deterministic JSON (sorted keys) so signer and verifier agree byte-for-byte. */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
}
