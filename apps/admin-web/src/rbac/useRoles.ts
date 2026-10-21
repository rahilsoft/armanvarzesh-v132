import { useSyncExternalStore } from 'react';
import {
  ANONYMOUS_SESSION,
  LOADING_SESSION,
  ADMIN_TOKEN_KEY,
  readToken,
  sessionFromToken,
  type AdminRole,
  type AdminSession,
} from './session';

let cachedToken: string | null | undefined;
let cachedSession: AdminSession = ANONYMOUS_SESSION;

// Snapshot must be referentially stable between calls while the token is unchanged.
function getSnapshot(): AdminSession {
  const token = readToken();
  if (token !== cachedToken) {
    cachedToken = token;
    cachedSession = sessionFromToken(token);
  }
  return cachedSession;
}

function getServerSnapshot(): AdminSession {
  return LOADING_SESSION;
}

function subscribe(onChange: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === null || e.key === ADMIN_TOKEN_KEY) onChange();
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

export type UseRoles = {
  status: AdminSession['status'];
  roles: AdminRole[];
  subject: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (required: AdminRole | AdminRole[]) => boolean;
};

/** Roles of the signed-in admin, derived from the session JWT (UI only, backend enforces). */
export function useRoles(): UseRoles {
  const session = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    status: session.status,
    roles: session.roles,
    subject: session.subject,
    loading: session.status === 'loading',
    isAuthenticated: session.status === 'authenticated',
    hasRole: (required) => {
      if (session.status !== 'authenticated') return false;
      const list = Array.isArray(required) ? required : [required];
      return list.some((r) => session.roles.includes(r));
    },
  };
}
