import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { trace, context as otelContext } from '@opentelemetry/api';

@Injectable()
export class TraceEnrichInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      const req: any = ctx.switchToHttp().getRequest();
      const span = trace.getSpan(otelContext.active());
      if (span) {
        const cid = req?.correlationId || req?.headers?.['x-correlation-id'] || req?.headers?.['x-request-id'];
        if (cid) span.setAttribute('correlation.id', String(cid));
        const uid = req?.user?.id || req?.userId;
        if (uid) span.setAttribute('user.id', String(uid));
        const route = (req?.route?.path) || req?.path || req?.url || '/';
        span.setAttribute('http.route', String(route));
      }
    } catch {}
    return next.handle();
  }
}
