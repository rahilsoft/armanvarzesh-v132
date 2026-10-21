import React from 'react';
import { useLocation } from 'react-router-dom';
import { Guarded } from '../rbac/Guarded';
import { rolesForPath } from '../rbac/routeRoles';
import type { AdminRole } from '../rbac/session';

/** Roles required for a pathname from the single ROUTE_ROLES map (undefined = any signed-in admin). */
export function roleRequirement(pathname: string): AdminRole[] | undefined {
  const roles = rolesForPath(pathname);
  return roles ? [...roles] : undefined;
}

/**
 * Route guard: requires a valid, unexpired admin session plus the roles from ROUTE_ROLES.
 * Unauthenticated users go to /login with the requested location kept for the post-login redirect.
 */
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <Guarded role={roleRequirement(location.pathname)} from={location.pathname + location.search}>
      {children}
    </Guarded>
  );
};

export default PrivateRoute;
