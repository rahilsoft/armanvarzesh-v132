import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const mockUseRoles = jest.fn();
jest.mock('../useRoles', () => ({ useRoles: () => mockUseRoles() }));
jest.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-redirect={to} />,
}));

import { Guarded } from '../Guarded';

const state = (status: string, roles: string[] = []) => ({
  status,
  roles,
  hasRole: (r: string | string[]) =>
    status === 'authenticated' && (Array.isArray(r) ? r : [r]).some((x) => roles.includes(x)),
});
const render = (role?: 'owner' | 'coach' | 'support' | Array<'owner' | 'coach' | 'support'>) =>
  renderToStaticMarkup(
    <Guarded role={role}>
      <span>secret</span>
    </Guarded>,
  );

describe('Guarded', () => {
  it('allowed: renders children', () => {
    mockUseRoles.mockReturnValue(state('authenticated', ['owner']));
    expect(render('owner')).toContain('secret');
  });
  it('allowed: any of several roles', () => {
    mockUseRoles.mockReturnValue(state('authenticated', ['support']));
    expect(render(['owner', 'support'])).toContain('secret');
  });
  it('authenticated without role requirement: renders children', () => {
    mockUseRoles.mockReturnValue(state('authenticated', []));
    expect(render()).toContain('secret');
  });
  it('denied: Persian 403, no children', () => {
    mockUseRoles.mockReturnValue(state('authenticated', ['support']));
    const html = render('owner');
    expect(html).not.toContain('secret');
    expect(html).toContain('شما اجازه دسترسی به این بخش را ندارید.');
  });
  it('loading: no children, no 403, spinner shown', () => {
    mockUseRoles.mockReturnValue(state('loading'));
    const html = render('owner');
    expect(html).not.toContain('secret');
    expect(html).not.toContain('اجازه دسترسی');
    expect(html).toContain('role="status"');
  });
  it('unauthenticated: redirects to /login', () => {
    mockUseRoles.mockReturnValue(state('unauthenticated'));
    const html = render('owner');
    expect(html).not.toContain('secret');
    expect(html).toContain('data-redirect="/login"');
  });
});
