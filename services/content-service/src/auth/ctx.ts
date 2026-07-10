import * as jwt from 'jsonwebtoken';

/**
 * Identity/role helpers for GraphQL resolvers. Identity comes ONLY from a
 * verified Bearer JWT — never from client-supplied x-user-id / x-role headers
 * (which allowed impersonation and privilege escalation) and never with a
 * hardcoded fallback secret (which allowed forgery). JWT_SECRET is required and
 * verification pins HS256.
 */
function jwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error('JWT_SECRET is not configured (minimum 16 characters required)');
  }
  return s;
}

export function ctxClaims(ctx: any): any | null {
  const h = ctx?.req?.headers || {};
  const b = (h['authorization'] || '').toString();
  if (!b.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(b.slice(7), jwtSecret(), { algorithms: ['HS256'] }) as any;
  } catch {
    return null;
  }
}

export function ctxUser(ctx: any): string | null {
  const d = ctxClaims(ctx);
  return d?.sub || d?.userId || null;
}

export function ctxRole(ctx: any): string {
  return ctxClaims(ctx)?.role || 'guest';
}
