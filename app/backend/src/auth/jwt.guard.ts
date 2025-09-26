import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { requireEnv } from '../common/utils/nulls';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
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
