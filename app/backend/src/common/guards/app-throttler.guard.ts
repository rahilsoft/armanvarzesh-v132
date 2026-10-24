import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Global rate limit that also understands GraphQL. The stock ThrottlerGuard
 * reads the request through switchToHttp(), which is undefined for a resolver,
 * so every GraphQL operation failed with "Cannot read properties of undefined
 * (reading 'ip')" (found by the REV-20261022-01 GraphQL e2e). For GraphQL the
 * HTTP request/response come from the Apollo context.
 */
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext): { req: Record<string, any>; res: Record<string, any> } {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext();
      return { req: ctx.req, res: ctx.res ?? ctx.req?.res };
    }
    return super.getRequestResponse(context);
  }
}
