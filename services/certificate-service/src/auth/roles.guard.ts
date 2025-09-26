import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [ context.getHandler(), context.getClass() ]) || [];
    if (!required.length) return true;
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] || '';
    const token = Array.isArray(auth) ? auth[0] : auth;
    const t = token.replace('Bearer ','').trim();
    if (!t) throw new ForbiddenException('No token');
    try {
      const payload:any = jwt.verify(t, process.env.CERT_SECRET || 'change_me');
      const roles = payload.roles || payload.role || [];
      const ok = (Array.isArray(roles)?roles:[roles]).some((r:string)=> required.includes(r));
      if (!ok) throw new ForbiddenException('Insufficient role');
      return true;
    } catch (e) { throw new ForbiddenException('Invalid token'); }
  }
}
