
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Example: Log audit info on every request
    return next.handle().pipe(
      tap(() => {
        // Add audit log logic here
      })
    );
  }
}
