/**
CacheControlInterceptor
Sets `Cache-Control` response header for GET handlers decorated with `@cacheControl(...)`.
@remarks
Non-global; apply as needed alongside other interceptors.
*/
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export interface CacheControlOptions { value: string }
export function cacheControl(value = 'public, max-age=60, stale-while-revalidate=30') {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('cache-control', value, descriptor.value);
    return descriptor;
  };
}

@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const handler = context.getHandler();
    const value = Reflect.getMetadata('cache-control', handler);
    if (req?.method === 'GET' && value && res?.setHeader) {
      res.setHeader('Cache-Control', value);
    }
    return next.handle();
  }
}
