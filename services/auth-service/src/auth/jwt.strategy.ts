import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenRevocationService } from './token-revocation.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly revocationService: TokenRevocationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // Check if token has been individually revoked (by JTI)
    if (payload.jti) {
      const isRevoked = await this.revocationService.isTokenRevoked(payload.jti);
      if (isRevoked) {
        throw new UnauthorizedException('Token has been revoked');
      }
    }

    // Check if all user tokens have been revoked (logout from all devices)
    if (payload.sub && payload.iat) {
      const areUserTokensRevoked = await this.revocationService.areUserTokensRevoked(
        payload.sub,
        payload.iat
      );
      if (areUserTokensRevoked) {
        throw new UnauthorizedException('User tokens have been revoked');
      }
    }

    return payload;
  }
}