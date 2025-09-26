import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { signer } from '@arman/auth-kit';

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller('.well-known')
export class JwksController {
  constructor(private readonly config: ConfigService) {}
  @Get('jwks.json')
  async getJwks() {
    const kid = process.env.JWT_KID || 'dev-1';
    const alg = (process.env.JWT_ALG as any) || 'RS256';
    const pem = process.env.JWKS_PRIVATE_PEM || '';
    if (!pem) {
      return { keys: [] }; // in production, return configured public keys
    }
    const s = await signer({ kid, alg, privatePEM: pem });
    return { keys: [s.jwk] };
  }
}