/** Minimum length for HMAC JWT secrets (HS256 needs >= 256 bits of key material). */
export const MIN_JWT_SECRET_LENGTH = 32;
/** Only HS256 is accepted for symmetric JWTs; every verify call must pin this. */
export const HS_ALGORITHMS: ['HS256'] = ['HS256'];

const isProd = () => process.env.NODE_ENV === 'production';

/**
 * Resolve a JWT secret from env. In production the secret must be present and
 * >= 32 chars (fail fast). Outside production a missing secret still throws;
 * short secrets are tolerated so local/test setups keep working.
 */
export function requireJwtSecret(...names: string[]): string {
  for (const name of names) {
    const v = process.env[name];
    if (!v) continue;
    if (isProd() && v.length < MIN_JWT_SECRET_LENGTH) {
      throw new Error(`${name} must be at least ${MIN_JWT_SECRET_LENGTH} characters in production`);
    }
    return v;
  }
  throw new Error(`Missing required env: ${names.join(' or ')}`);
}

/** Like requireJwtSecret but returns undefined when none of the names is set (non-production only). */
export function optionalJwtSecret(...names: string[]): string | undefined {
  const anySet = names.some((n) => !!process.env[n]);
  if (!anySet && !isProd()) return undefined;
  return requireJwtSecret(...names);
}
