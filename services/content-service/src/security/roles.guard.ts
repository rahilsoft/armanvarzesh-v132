
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from './roles.decorator';
import { jwtVerify, createRemoteJWKSet } from 'jose';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req: any = context.switchToHttp().getRequest?.() || context.getArgByIndex?.(2)?.req;
    const auth = req?.headers?.authorization || '';
    if (!auth.startsWith('Bearer ')) return false;
    const token = auth.slice(7).trim();
    try {
      const jwks = process.env.AUTH_JWKS_URL ? createRemoteJWKSet(new URL(process.env.AUTH_JWKS_URL)) : undefined;
      const publicKey = process.env.ADMIN_JWT_PUBLIC_KEY;
      let payload: any;
      if (jwks) {
        const v = await jwtVerify(token, jwks, { issuer: process.env.AUTH_ISSUER || undefined, audience: process.env.AUTH_AUDIENCE || undefined });
        payload = v.payload;
      } else if (publicKey) {
        const v = await jwtVerify(token, new TextEncoder().encode(publicKey));
        payload = v.payload;
      } else {
        return false;
      }
      const roles = (payload['roles'] as string[]) || (payload['scope'] ? String(payload['scope']).split(' ') : []);
      return requiredRoles.some(r => roles.includes(r));
    } catch (e) {
      return false;
    }
  }
}
