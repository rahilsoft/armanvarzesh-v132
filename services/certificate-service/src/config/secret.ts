/**
 * Fail-closed accessor for the certificate signing secret. There is no
 * hardcoded fallback: a missing/short CERT_SECRET is a hard error rather than a
 * publicly-known default (which previously allowed trivial token forgery).
 */
export function certSecret(): string {
  const s = process.env.CERT_SECRET;
  if (!s || s.length < 16) {
    throw new Error('CERT_SECRET is not configured (minimum 16 characters required)');
  }
  return s;
}
