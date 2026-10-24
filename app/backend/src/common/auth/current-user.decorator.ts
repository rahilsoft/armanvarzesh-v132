import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/** Authenticated principal derived from the verified JWT (set by JwtAuthGuard). */
export interface AuthPrincipal {
  userId: number;
  email?: string;
  role: string;
}

/**
 * Build the principal from verified claims on `req.user`. The access token's
 * `sub` claim is the stringified User.id; it is parsed back to the canonical
 * Int here. Throws if the request is unauthenticated.
 */
export function principalFromRequest(req: any): AuthPrincipal {
  const raw = req?.user;
  const sub = raw?.sub ?? raw?.userId;
  const userId = Number(sub);
  if (!raw || !Number.isInteger(userId) || userId <= 0) {
    throw new UnauthorizedException('unauthenticated');
  }
  return { userId, email: raw.email, role: raw.role ?? 'user' };
}

/**
 * Injects the authenticated user from `req.user` (populated by JwtAuthGuard).
 * Every route using this decorator MUST be behind JwtAuthGuard.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthPrincipal => principalFromRequest(ctx.switchToHttp().getRequest()),
);

/** GraphQL variant: reads the principal from the HTTP request behind the resolver (GqlJwtAuthGuard). */
export const GqlCurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthPrincipal => principalFromRequest(GqlExecutionContext.create(ctx).getContext()?.req),
);
