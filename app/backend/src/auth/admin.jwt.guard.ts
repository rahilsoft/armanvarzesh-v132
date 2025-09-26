import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { AdminRole } from './roles.decorator';

export interface AdminClaims { sub: string; role: AdminRole; iat?: number; exp?: number; }

@Injectable()
export class AdminJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = (req.headers['authorization'] || '') as string;
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) throw new UnauthorizedException('missing token');
    // Use either an inline PEM/b64 key (ADMIN_JWT_PUBLIC_KEY) or read from ADMIN_JWT_PUBLIC_KEY_PATH.
    let key: Buffer | string | undefined;
    const envKey = process.env.ADMIN_JWT_PUBLIC_KEY;
    if (envKey) {
      // Accept base64 or PEM encoded values
      key = envKey.includes('-----BEGIN') ? envKey : Buffer.from(envKey, 'base64').toString('utf8');
    } else {
      const path = process.env.ADMIN_JWT_PUBLIC_KEY_PATH;
      if (!path || !fs.existsSync(path)) {
        throw new UnauthorizedException('public key missing');
      }
      key = fs.readFileSync(path);
    }
    try {
      const claims = jwt.verify(token, key, { algorithms: ['RS256'] }) as AdminClaims;
      req.user = claims;
      return true;
    } catch (e) {
      throw new UnauthorizedException('invalid token');
    }
  }
}
