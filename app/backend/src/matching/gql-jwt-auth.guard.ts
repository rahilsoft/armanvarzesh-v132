import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/jwt.guard';

/** GraphQL adapter for JwtAuthGuard: verifies the Bearer JWT on the underlying HTTP request. */
@Injectable()
export class GqlJwtAuthGuard implements CanActivate {
  private readonly inner = new JwtAuthGuard();

  canActivate(context: ExecutionContext): boolean {
    const req = GqlExecutionContext.create(context).getContext()?.req;
    return this.inner.canActivate({ switchToHttp: () => ({ getRequest: () => req }) } as unknown as ExecutionContext);
  }
}
