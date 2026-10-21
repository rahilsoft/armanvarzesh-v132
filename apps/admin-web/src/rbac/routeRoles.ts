import type { AdminRole } from './session';

/**
 * Single source of truth: route prefix -> roles allowed to open it (any of).
 * Deny by default: a path that matches no entry still requires a signed-in admin,
 * and an entry with an empty list is never allowed. The backend enforces roles too.
 */
export const ROUTE_ROLES: Readonly<Record<string, readonly AdminRole[]>> = {
  '/dashboard': ['owner', 'coach', 'support'],
  '/payments': ['owner'],
  '/wallet': ['owner'],
  '/admins': ['owner'],
  '/settings': ['owner'],
  '/users': ['owner', 'support'],
  '/coaches': ['owner', 'support'],
  '/marketplace': ['owner', 'support'],
  '/notifications': ['owner', 'support'],
  '/survey': ['owner', 'support'],
  '/analytics': ['owner'],
  '/rewards': ['owner', 'support'],
  '/challenges': ['owner', 'coach', 'support'],
  '/leaderboard': ['owner', 'coach', 'support'],
  '/workouts': ['owner', 'coach'],
  '/nutrition': ['owner', 'coach'],
};

/** Roles required for a pathname, or undefined when the path is not in the map. */
export function rolesForPath(pathname: string): readonly AdminRole[] | undefined {
  const key = Object.keys(ROUTE_ROLES).find((p) => pathname === p || pathname.startsWith(`${p}/`));
  return key ? ROUTE_ROLES[key] : undefined;
}
