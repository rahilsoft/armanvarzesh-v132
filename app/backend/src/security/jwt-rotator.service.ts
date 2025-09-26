import * as jwt from 'jsonwebtoken';

export class JwtKidService {
  private keys: Record<string, string>;
  private active: string;
  private alg: jwt.Algorithm;

  constructor() {
    // Parse provided key set mapping kid→key. If using asymmetric algorithms (RS256/ES256),
    // values should be PEM‐encoded private keys for signing. Public keys must be provided
    // separately via JWT_PUBLIC_KEYS for verification. See .env.example for details.
    try {
      this.keys = JSON.parse(process.env.JWT_KEYS || '{}');
    } catch {
      this.keys = {};
    }
    this.active = process.env.JWT_ACTIVE_KID || 'k1';
    // Default to RS256 for stronger security when not explicitly set
    this.alg = (process.env.JWT_ALG as jwt.Algorithm) || 'RS256';
    // Backwards compatibility: allow JWT_SECRET to populate keys for symmetric algorithms
    if (!this.keys[this.active] && process.env.JWT_SECRET) {
      this.keys[this.active] = process.env.JWT_SECRET;
    }
  }

  /** Sign a JWT using the active kid. For RS256/ES256 the stored key must be a private key. */
  sign(payload: any, expiresIn = process.env.JWT_EXPIRES_IN || '3600s'): string {
    const secret = this.keys[this.active];
    if (!secret) throw new Error('No secret for active kid');
    return jwt.sign(payload, secret, { algorithm: this.alg, header: { kid: this.active }, expiresIn });
  }

  /** Verify a JWT using the appropriate key. If asymmetric, prefer JWT_PUBLIC_KEYS env. */
  verify(token: string): any {
    const decoded: any = jwt.decode(token, { complete: true });
    const kid = decoded?.header?.kid;
    let key: string | undefined;
    // For asymmetric algorithms, try to resolve from JWT_PUBLIC_KEYS (JSON mapping)
    if (this.alg.startsWith('RS') || this.alg.startsWith('ES')) {
      try {
        const publics = JSON.parse(process.env.JWT_PUBLIC_KEYS || '{}');
        key = kid ? publics[kid] : undefined;
      } catch {
        key = undefined;
      }
    }
    // Fallback to local keys (symmetric or misconfigured)
    if (!key) {
      key = kid ? this.keys[kid] : process.env.JWT_SECRET;
    }
    if (!key) throw new Error('JWT key not found');
    return jwt.verify(token, key, { algorithms: [this.alg] });
  }
}
