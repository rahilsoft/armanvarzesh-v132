// Phase G — logging interceptor with redaction + correlation id
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { redactSensitive } from './redact';

@Injectable()
export class RedactLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body } = req || {};
    const cid = (req as any)?.correlationId || (req?.headers?.['x-correlation-id'] as string) || 'no-cid';
    const t0 = Date.now();
    this.logger.log(`[${cid}] → ${method} ${url} body=${JSON.stringify(redactSensitive(body))}`);
    return next.handle().pipe(tap((data) => {
      const dt = Date.now() - t0;
      this.logger.log(`[${cid}] ← ${method} ${url} ${dt}ms resp=${JSON.stringify(redactSensitive(data))}`);
    }));
  }
}
