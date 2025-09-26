
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Example: Security checks before/after request
    return next.handle().pipe(
      tap(() => {
        // Post-processing, e.g. logging security-relevant info
      })
    );
  }
}
