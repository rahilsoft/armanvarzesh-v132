import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { LoadersFactory } from './loaders.factory';

@Injectable()
export class LoadersInterceptor implements NestInterceptor {
  constructor(private factory: LoadersFactory) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();
      if (ctx && !ctx.loaders) {
        ctx.loaders = this.factory.create();
      }
    }
    return next.handle();
  }
}
