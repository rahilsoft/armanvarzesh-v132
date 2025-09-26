import { Controller, Get } from '@nestjs/common';

/**
 * Exposes JWKS (public keys) for RS256 verification.
 * Provide KEY_ID and PUBLIC_JWK via environment or mount a secret file and parse.
 */
@Controller('/.well-known')
export class JwksController {
  @Get('/jwks.json')
  jwks() {
    try {
      const raw = process.env.PUBLIC_JWKS_JSON;
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {}
    // fallback empty set (replace at deploy-time via env or secret mount)
    return { keys: [] };
  }
}
