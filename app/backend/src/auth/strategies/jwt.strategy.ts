import { requireEnv } from '../../common/utils/nulls';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/** JwtPayload
 *  Shape of JWT payload used in the system.
 */
export interface JwtPayload {
  userId: number;
  role?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const publicKey = process.env.JWT_PUBLIC_KEY || process.env.JWT_ACCESS_PUBLIC_KEY || process.env.ADMIN_JWT_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error('Missing JWT_PUBLIC_KEY/JWT_ACCESS_PUBLIC_KEY');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
      algorithms: ['RS256'],
    });
  }
  async validate(payload: JwtPayload) {
    return { userId: payload.userId, role: payload.role };
  }
}