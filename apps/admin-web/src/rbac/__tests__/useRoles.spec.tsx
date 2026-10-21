import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useRoles } from '../useRoles';

function Probe() {
  const r = useRoles();
  return <i data-status={r.status} data-roles={r.roles.join(',')} data-can-owner={String(r.hasRole('owner'))} />;
}

describe('useRoles', () => {
  it('reports loading and no access before the client session resolves (server snapshot)', () => {
    const html = renderToStaticMarkup(<Probe />);
    expect(html).toContain('data-status="loading"');
    expect(html).toContain('data-roles=""');
    expect(html).toContain('data-can-owner="false"');
  });
});
