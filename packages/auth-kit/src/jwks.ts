import { createPublicKey, KeyObject } from 'crypto';
import { importPKCS8, SignJWT, exportJWK, JWK, jwtVerify } from 'jose';

export type KeySpec = { kid: string; alg: 'RS256'|'ES256'; privatePEM: string };

export async function signer(spec: KeySpec) {
  const privateKey = await importPKCS8(spec.privatePEM, spec.alg);
  const pub = createPublicKey(spec.privatePEM);
  const jwk = await exportJWK(pub as unknown as KeyObject) as JWK;
  jwk.kid = spec.kid;
  jwk.alg = spec.alg;
  jwk.use = 'sig';

  return {
    jwk,
    async sign(payload: Record<string, any>, opts: { iss?: string; aud?: string; expSec?: number } = {}) {
      const now = Math.floor(Date.now() / 1000);
      const exp = now + (opts.expSec ?? 3600);
      return await new SignJWT(payload)
        .setProtectedHeader({ alg: spec.alg, kid: spec.kid })
        .setIssuedAt(now)
        .setExpirationTime(exp)
        .setIssuer(opts.iss ?? 'arman')
        .setAudience(opts.aud ?? 'arman-users')
        .sign(privateKey);
    },
    async verify(token: string, jwksUrl?: string) {
      // For verification, prefer remote JWKS if provided; else verify with local public key
      try {
        const { createRemoteJWKSet } = await import('jose');
        if (jwksUrl) {
          const JWKS = createRemoteJWKSet(new URL(jwksUrl));
          return await jwtVerify(token, JWKS);
        }
      } catch {}
      // Local verification fallback (not rotating)
      const pubKey = createPublicKey(spec.privatePEM);
      return await jwtVerify(token, pubKey);
    }
  };
}
