/**
 * Admin session helpers. The backend (`POST /admin/login`) issues a JWT with claims
 * `{ sub, role, iat, exp }` and the SPA stores it in localStorage under `admin_token`.
 * There is no `me` query yet, so claims are decoded here for UI gating only.
 * The backend re-verifies the signature and role on every request (AdminJwtGuard + RolesGuard).
 */
export type AdminRole = 'owner' | 'coach' | 'support';

export const ADMIN_TOKEN_KEY = 'admin_token';

const KNOWN_ROLES: readonly string[] = ['owner', 'coach', 'support'];

export type AdminSession =
  | { status: 'loading'; roles: AdminRole[]; subject: null }
  | { status: 'unauthenticated'; roles: AdminRole[]; subject: null }
  | { status: 'authenticated'; roles: AdminRole[]; subject: string };

export const LOADING_SESSION: AdminSession = { status: 'loading', roles: [], subject: null };
export const ANONYMOUS_SESSION: AdminSession = { status: 'unauthenticated', roles: [], subject: null };

function base64UrlDecode(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Decode a JWT payload without verifying it. Returns null when malformed. */
export function decodeClaims(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Pure: turn a raw token into a session. `nowMs` is injectable for tests. */
export function sessionFromToken(token: string | null, nowMs: number = Date.now()): AdminSession {
  if (!token) return ANONYMOUS_SESSION;
  const claims = decodeClaims(token);
  if (!claims) return ANONYMOUS_SESSION;
  const exp = claims.exp;
  // Backend always signs with expiresIn: a token without exp is not a valid admin session.
  if (typeof exp !== 'number' || exp * 1000 <= nowMs) return ANONYMOUS_SESSION;
  const rawRoles = Array.isArray(claims.roles) ? claims.roles : [claims.role];
  const roles = rawRoles.filter((r): r is AdminRole => typeof r === 'string' && KNOWN_ROLES.includes(r));
  const subject = typeof claims.sub === 'string' ? claims.sub : '';
  return { status: 'authenticated', roles, subject };
}

/** Expiry in ms of a token's `exp` claim, or null when absent/malformed. */
export function tokenExpiryMs(token: string | null): number | null {
  if (!token) return null;
  const exp = decodeClaims(token)?.exp;
  return typeof exp === 'number' ? exp * 1000 : null;
}

export function readToken(): string | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}
