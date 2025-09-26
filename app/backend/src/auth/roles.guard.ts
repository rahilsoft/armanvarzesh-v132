import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Reflector } from '@nestjs/common';
import { ROLES_KEY, AdminRole } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<AdminRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const role: AdminRole | undefined = req.user?.role;
    if (role && roles.includes(role)) return true;
    throw new ForbiddenException('insufficient role');
  }
}
