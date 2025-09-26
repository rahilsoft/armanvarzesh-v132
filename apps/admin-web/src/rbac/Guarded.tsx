import React from 'react';
type Props={ role: string; children: React.ReactNode };
export function Guarded({role, children}: Props){
  // TODO: wire to real auth/roles
  const allowed = true; // replace with selector
  return allowed ? <>{children}</> : null;
}
