import { CanActivate, ExecutionContext, Injectable, Reflector, ForbiddenException } from '@nestjs/common';
import { DOUBLE_CONFIRM } from './double-confirm.decorator';

@Injectable()
export class DoubleConfirmGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const needed = this.reflector.getAllAndOverride<boolean>(DOUBLE_CONFIRM, [context.getHandler(), context.getClass()]);
    if (!needed) return true;
    const req = context.switchToHttp().getRequest();
    const hdr = (req?.headers?.['x-confirm-token'] as string) || '';
    if (!hdr || hdr.length < 8) throw new ForbiddenException('Missing/invalid X-Confirm-Token');
    // NOTE: plug real token verification here (e.g., one-time token store)
    return true;
  }
}
