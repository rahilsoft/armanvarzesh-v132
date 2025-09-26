
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
/**
 * AdminGuard (DEV scaffold):
 * - Expects Authorization: Bearer <token>
 * - In production, verify JWT against JWKS / PUBLIC KEY (env ADMIN_JWT_PUBLIC_KEY) or delegate to auth-service.
 * - For now, if header missing => deny for mutations; queries remain public.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest?.() || context.getArgByIndex?.(2)?.req;
    const auth = req?.headers?.authorization || '';
    if (!auth.startsWith('Bearer ')) return false;
    const token = auth.slice(7).trim();
    // TODO: verify with JWKS/public key; dev: accept any non-empty token
    return token.length > 0;
  }
}
