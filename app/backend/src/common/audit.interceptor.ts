import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AUDIT_ACTION } from './audit-action.decorator';
import * as fs from 'fs';

function writeAudit(line: string) {
  const p = process.env.AUDIT_LOG_PATH;
  if (p) { try { fs.appendFileSync(p, line + '\n'); } catch {} }
  // Always also print to stdout as JSON (can be parsed by log pipeline)
  console.log(line);
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req: any = ctx.switchToHttp().getRequest();
    const action = this.reflector.getAllAndOverride<string>(AUDIT_ACTION, [ctx.getHandler(), ctx.getClass()]);
    if (!action) return next.handle();
    const userId = req?.user?.id || 'anon';
    const cid = req?.correlationId || req?.headers?.['x-correlation-id'] || 'no-cid';
    const t0 = Date.now();
    return next.handle().pipe(tap((res) => {
      const dt = Date.now() - t0;
      const line = JSON.stringify({ ts: new Date().toISOString(), action, userId, cid, method: req?.method, url: req?.url, dt });
      writeAudit(line);
    }));
  }
}
