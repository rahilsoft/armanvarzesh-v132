import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { optionalJwtSecret, HS_ALGORITHMS } from '../config/jwt-secrets';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = (req.headers['authorization'] || '') as string;
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    const expected = process.env.ADMIN_API_TOKEN;
    if (expected && token === expected) return true;
    let secret: string | undefined;
    try { secret = optionalJwtSecret('ADMIN_JWT_SECRET'); } catch { secret = undefined; }
    if (secret && token){ try { const claims:any = jwt.verify(token, secret, { algorithms: HS_ALGORITHMS }); (req as any).user = claims; return true; } catch {}
    }
    throw new UnauthorizedException('admin auth required');
  }
}
