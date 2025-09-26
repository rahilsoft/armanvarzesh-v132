import { CanActivate, ExecutionContext, Injectable, Reflector } from '@nestjs/common';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), context.getClass(),
    ]);
    if (!required || required.length === 0) return true; // no metadata -> allow
    const req = context.switchToHttp().getRequest();
    const roles: string[] = (req?.user?.roles) || (req?.user?.role ? [req.user.role] : []);
    if (!roles || roles.length === 0) return false;
    return required.some(r => roles.includes(r));
  }
}
