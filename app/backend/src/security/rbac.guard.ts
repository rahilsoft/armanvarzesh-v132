import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

export type Role = 'user' | 'coach' | 'admin' | 'service';

export const rolesKey = 'roles';
@Injectable()
export class RbacGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user || {};
    const roles: Role[] = (req.route?.meta?.roles) || user.roles || [];
    if (!roles || roles.length === 0) return true;
    const has = (user.roles || []).some((r: Role) => roles.includes(r));
    if (!has) throw new ForbiddenException('Insufficient role');
    return true;
  }
}
