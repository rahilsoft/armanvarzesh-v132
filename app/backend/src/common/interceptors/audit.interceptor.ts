import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { Request } from 'express';

/** AuditInterceptor
 *  Logs who called which endpoint (basic audit trail).
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const logger = new Logger(AuditInterceptor.name);
    return next.handle().pipe(
      tap(() => {
        logger.log(`[AUDIT] User ${String((req as any).user?.id ?? 'anon')} called ${req.method} ${req.url}`);
      }),
    );
  }
}