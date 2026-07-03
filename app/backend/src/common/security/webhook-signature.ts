import { createHmac, timingSafeEqual } from 'crypto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

/**
 * Verify an inbound webhook is authentic before any state change (P0-2).
 *
 * External provider callbacks (payment PSP, lab results) are unauthenticated by
 * bearer token, so they are authenticated by an HMAC-SHA256 signature over the
 * canonical JSON body using a shared secret. The signature is expected in the
 * payload as `signature` (hex). Comparison is constant-time.
 *
 * In production the secret is REQUIRED — a missing secret is a hard failure
 * (fail-closed), never an implicit "skip verification". Outside production a
 * missing secret disables verification so local/test flows work.
 */
export function computeWebhookSignature(secret: string, body: unknown): string {
  const canonical = stableStringify(stripSignature(body));
  return createHmac('sha256', secret).update(canonical).digest('hex');
}

export function verifyWebhookSignature(
  channel: string,
  body: unknown,
  secret: string | undefined,
): void {
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException(`${channel} webhook secret is not configured`);
    }
    return; // dev/test: verification disabled
  }
  const provided = (body as { signature?: unknown } | null)?.signature;
  if (typeof provided !== 'string' || provided.length === 0) {
    throw new BadRequestException(`${channel} webhook signature missing`);
  }
  const expected = computeWebhookSignature(secret, body);
  const a = Buffer.from(provided, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new UnauthorizedException(`${channel} webhook signature invalid`);
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

function stripSignature(body: unknown): unknown {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body;
  const { signature: _sig, ...rest } = body as Record<string, unknown>;
  return rest;
}
