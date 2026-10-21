import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const mockUseRoles = jest.fn();
let mockPath = '/dashboard';
jest.mock('../../rbac/useRoles', () => ({ useRoles: () => mockUseRoles() }));
jest.mock('react-router-dom', () => ({
  Navigate: ({ to, state }: { to: string; state?: { from?: string } }) => (
    <div data-redirect={to} data-from={state?.from ?? ''} />
  ),
  useLocation: () => ({ pathname: mockPath, search: '?a=1' }),
}));

import PrivateRoute, { roleRequirement } from '../PrivateRoute';
import { ROUTE_ROLES, rolesForPath } from '../../rbac/routeRoles';
import { adminRoutes } from '../adminRoutes';

const state = (status: string, roles: string[] = []) => ({
  status,
  roles,
  hasRole: (r: string | string[]) =>
    status === 'authenticated' && (Array.isArray(r) ? r : [r]).some((x) => roles.includes(x)),
});
const render = (path: string) => {
  mockPath = path;
  return renderToStaticMarkup(
    <PrivateRoute>
      <span>secret</span>
    </PrivateRoute>,
  );
};

describe('PrivateRoute', () => {
  it('no session: redirects to /login and remembers requested route', () => {
    mockUseRoles.mockReturnValue(state('unauthenticated'));
    const html = render('/payments');
    expect(html).toContain('data-redirect="/login"');
    expect(html).toContain('data-from="/payments?a=1"');
    expect(html).not.toContain('secret');
  });

  it('loading: shows nothing protected', () => {
    mockUseRoles.mockReturnValue(state('loading'));
    expect(render('/payments')).not.toContain('secret');
  });

  it('payments is owner only', () => {
    mockUseRoles.mockReturnValue(state('authenticated', ['support']));
    const html = render('/payments/42');
    expect(html).not.toContain('secret');
    expect(html).toContain('شما اجازه دسترسی به این بخش را ندارید.');
    mockUseRoles.mockReturnValue(state('authenticated', ['owner']));
    expect(render('/payments/42')).toContain('secret');
  });

  it('dashboard open to any signed-in role', () => {
    mockUseRoles.mockReturnValue(state('authenticated', ['coach']));
    expect(render('/dashboard')).toContain('secret');
  });

  it('role claim of an unknown/empty set is denied on mapped routes', () => {
    mockUseRoles.mockReturnValue(state('authenticated', []));
    expect(render('/dashboard')).not.toContain('secret');
  });
});

describe('route role map', () => {
  it('every admin route has an entry (single source of truth)', () => {
    adminRoutes.forEach((r) => expect(ROUTE_ROLES[r.path]).toBeDefined());
  });
  it('prefix match requires a path boundary', () => {
    expect(rolesForPath('/paymentsx')).toBeUndefined();
    expect(roleRequirement('/payments')).toEqual(['owner']);
  });
});
