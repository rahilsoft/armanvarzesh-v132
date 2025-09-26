import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Always prefer asymmetric keys (RS256) for JWT verification. Fall back to environment-provided
    // public keys and remove hard‑coded secrets. See packages/env-config for schema.
    const publicKey = process.env.JWT_PUBLIC_KEY || process.env.ADMIN_JWT_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error('Missing JWT_PUBLIC_KEY or ADMIN_JWT_PUBLIC_KEY');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });
  }
  async validate(payload: any) {
    return { sub: payload.sub, role: payload.role || 'user' };
  }
}
