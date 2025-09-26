import React from 'react';
import { can, type Feature, type Action, type UserCtx } from '../rbac';

export function Guard({ user, feature, action, fallback, children }:{ user?:UserCtx; feature:Feature; action:Action; fallback?:React.ReactNode; children:React.ReactNode }){
  const ok = can(user, feature, action);
  if(!ok) return <>{fallback||null}</>;
  return <>{children}</>;
}
export default Guard;
