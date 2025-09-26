import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        const log = {
          ts: new Date().toISOString(),
          method: req?.method,
          path: req?.url,
          status: context.switchToHttp().getResponse()?.statusCode,
          duration_ms: ms,
          userId: req?.user?.id || null,
          requestId: req?.headers?.['x-request-id'] || null
        };
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(log));
      }),
    );
  }
}
