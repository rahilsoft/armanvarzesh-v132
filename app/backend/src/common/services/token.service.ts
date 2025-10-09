import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  private readonly algorithm: jwt.Algorithm;
  private readonly privateKey: string;
  private readonly publicKey?: string;
  private readonly keyId?: string;
  private readonly issuer?: string;
  private readonly audience?: string;
  private readonly defaultExpiresIn: string | number;

  constructor() {
    const envAlg = (process.env.JWT_ALG as jwt.Algorithm | undefined) || 'RS256';
    if (envAlg !== 'RS256') {
      throw new Error(`TokenService only supports RS256 but received ${envAlg}`);
    }
    const privateKey = process.env.JWT_PRIVATE_KEY || process.env.JWKS_PRIVATE_PEM || '';
    if (!privateKey.trim()) {
      throw new Error('TokenService requires JWT_PRIVATE_KEY or JWKS_PRIVATE_PEM to be configured');
    }
    this.algorithm = envAlg;
    this.privateKey = privateKey;
    const publicKey = process.env.JWT_PUBLIC_KEY || process.env.JWKS_PUBLIC_PEM || '';
    this.publicKey = publicKey ? publicKey : undefined;
    this.keyId = process.env.JWT_ACTIVE_KID || process.env.JWT_KID || undefined;
    this.issuer = process.env.JWT_ISSUER || undefined;
    this.audience = process.env.JWT_AUDIENCE || undefined;
    this.defaultExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  sign(payload: object, expiresIn: string | number = this.defaultExpiresIn): string {
    return (jwt as any).sign(payload, this.privateKey, {
      algorithm: this.algorithm,
      expiresIn,
      keyid: this.keyId,
      issuer: this.issuer,
      audience: this.audience,
    });
  }

  verify<T = any>(token: string): T {
    const verificationKey = this.publicKey || this.privateKey;
    return (jwt as any).verify(token, verificationKey, {
      algorithms: [this.algorithm],
      issuer: this.issuer,
      audience: this.audience,
    }) as T;
  }
}
