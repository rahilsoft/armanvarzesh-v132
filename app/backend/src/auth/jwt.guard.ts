import { CanActivate, ExecutionContext, Injectable, Optional, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { requireEnv } from '../common/utils/nulls';
import { IS_PUBLIC_KEY } from '../common/auth/public.decorator';

/**
 * Bearer-JWT guard. Verifies the HS256 access token signed by UserAuthService
 * with JWT_SECRET and attaches the decoded claims to `req.user`. Reflector is
 * optional: when present it honours `@Public()` so a controller can be guarded
 * as a whole while exempting webhook/public routes.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Optional() private readonly reflector?: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.reflector) {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) return true;
    }
    const req = context.switchToHttp().getRequest();
    const header: string | undefined = req?.headers?.authorization || req?.headers?.Authorization;
    if (!header || typeof header !== 'string') throw new UnauthorizedException('missing authorization header');
    const [type, token] = header.split(' ');
    if (!token || type?.toLowerCase() !== 'bearer') throw new UnauthorizedException('invalid authorization header');
    try {
      const secret = requireEnv('JWT_SECRET');
      const payload = jwt.verify(token, secret);
      (req as any).user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException('invalid token');
    }
  }
}
