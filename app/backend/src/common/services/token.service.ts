import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { createPublicKey } from 'crypto';

type KeyEntry = {
  privateKey: string;
  publicKey: string;
};

@Injectable()
export class TokenService {
  private readonly algorithm: jwt.Algorithm = 'RS256';
  private readonly issuer = process.env.JWT_ISSUER || undefined;
  private readonly audience = process.env.JWT_AUDIENCE || undefined;
  private readonly activeKid: string;
  private readonly keys: Record<string, KeyEntry> = {};

  constructor() {
    const keyMap = this.parseKeyMap();
    const active = process.env.JWT_ACTIVE_KID || Object.keys(keyMap)[0];
    if (!active || !keyMap[active]) {
      throw new Error('Active JWT kid is not configured. Set JWT_ACTIVE_KID and JWT_KEYS.');
    }
    this.activeKid = active;

    for (const [kid, raw] of Object.entries(keyMap)) {
      const pem = this.normalizePem(raw);
      const publicKey = createPublicKey(pem).export({ type: 'spki', format: 'pem' }).toString();
      this.keys[kid] = { privateKey: pem, publicKey };
    }
  }

  private parseKeyMap(): Record<string, string> {
    const sources = [process.env.JWT_KEYS, process.env.JWT_SECRETS];
    for (const source of sources) {
      if (!source) continue;
      try {
        const parsed = JSON.parse(source);
        if (Object.keys(parsed).length > 0) {
          return parsed;
        }
      } catch (e) {
        throw new Error('JWT_KEYS must contain valid JSON mapping kid→private key');
      }
    }

    const single = process.env.JWT_PRIVATE_KEY || process.env.JWT_PRIVATE_PEM;
    if (single) {
      return { default: single };
    }
    throw new Error('No RS256 signing keys configured. Provide JWT_KEYS or JWT_PRIVATE_KEY.');
  }

  private normalizePem(value: string): string {
    const trimmed = (value || '').trim();
    if (!trimmed) {
      throw new Error('Empty signing key provided');
    }
    if (trimmed.includes('-----BEGIN')) {
      return trimmed;
    }
    try {
      const decoded = Buffer.from(trimmed, 'base64').toString('utf8');
      return decoded.includes('-----BEGIN') ? decoded : trimmed;
    } catch {
      return trimmed;
    }
  }

  private getKey(kid: string): KeyEntry {
    const entry = this.keys[kid];
    if (!entry) {
      throw new Error(`Signing key not found for kid ${kid}`);
    }
    return entry;
  }

  sign(payload: object, expiresIn = '7d'): string {
    const key = this.getKey(this.activeKid);
    return (jwt as any).sign(payload, key.privateKey, {
      algorithm: this.algorithm,
      expiresIn,
      keyid: this.activeKid,
      issuer: this.issuer,
      audience: this.audience,
    });
  }

  verify<T = any>(token: string): T {
    const decoded = (jwt as any).decode(token, { complete: true }) as jwt.Jwt | null;
    const kid = (decoded?.header as jwt.JwtHeader | undefined)?.kid || this.activeKid;
    const key = this.getKey(kid);
    return (jwt as any).verify(token, key.publicKey, {
      algorithms: [this.algorithm],
      issuer: this.issuer,
      audience: this.audience,
    }) as T;
  }
}
