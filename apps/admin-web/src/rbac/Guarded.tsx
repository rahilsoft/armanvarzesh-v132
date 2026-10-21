import React from 'react';
import { Navigate } from 'react-router-dom';
import { Result, Spin } from 'antd';
import { useRoles } from './useRoles';
import type { AdminRole } from './session';

type Props = {
  /** One or more roles; the admin needs at least one. Omit to require only a signed-in admin. */
  role?: AdminRole | AdminRole[];
  /** Location to return to after login (passed to /login as router state). */
  from?: string;
  children: React.ReactNode;
};

/**
 * UI gate only. The backend enforces roles on every request.
 * loading => spinner, no session => redirect to /login, missing role => Persian 403.
 */
export function Guarded({ role, from, children }: Props) {
  const { status, hasRole } = useRoles();

  if (status === 'loading') {
    return (
      <div role="status" style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin tip="در حال بررسی دسترسی" size="large">
          <div style={{ padding: 32 }} />
        </Spin>
      </div>
    );
  }
  if (status === 'unauthenticated') return <Navigate to="/login" replace state={from ? { from } : undefined} />;
  if (role !== undefined && !hasRole(role)) {
    return <Result status="403" title="۴۰۳" subTitle="شما اجازه دسترسی به این بخش را ندارید." />;
  }
  return <>{children}</>;
}

export default Guarded;
