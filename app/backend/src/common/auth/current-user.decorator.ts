import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/** Authenticated principal derived from the verified JWT (set by JwtAuthGuard). */
export interface AuthPrincipal {
  userId: number;
  email?: string;
  role: string;
}

/**
 * Injects the authenticated user from `req.user` (populated by JwtAuthGuard).
 * The access token's `sub` claim is the stringified User.id; it is parsed back
 * to the canonical Int here. Throws if the request is unauthenticated — every
 * route using this decorator MUST be behind JwtAuthGuard.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthPrincipal => {
    const req = ctx.switchToHttp().getRequest();
    const raw = req?.user;
    const sub = raw?.sub ?? raw?.userId;
    const userId = Number(sub);
    if (!raw || !Number.isInteger(userId) || userId <= 0) {
      throw new UnauthorizedException('unauthenticated');
    }
    return { userId, email: raw.email, role: raw.role ?? 'user' };
  },
);
