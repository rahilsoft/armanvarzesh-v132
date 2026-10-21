import { useSyncExternalStore } from 'react';
import {
  ANONYMOUS_SESSION,
  LOADING_SESSION,
  ADMIN_TOKEN_KEY,
  readToken,
  sessionFromToken,
  tokenExpiryMs,
  type AdminRole,
  type AdminSession,
} from './session';

let cachedToken: string | null | undefined;
let cachedSession: AdminSession = ANONYMOUS_SESSION;
let cachedExpiryMs: number | null = null;

// Snapshot must be referentially stable between calls while the token is unchanged,
// but an authenticated snapshot is dropped once the token's exp has passed.
function getSnapshot(): AdminSession {
  const token = readToken();
  const expired =
    cachedSession.status === 'authenticated' && cachedExpiryMs !== null && cachedExpiryMs <= Date.now();
  if (token !== cachedToken || expired) {
    cachedToken = token;
    cachedSession = sessionFromToken(token);
    cachedExpiryMs = tokenExpiryMs(token);
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
  // Re-render when the current token expires so gated UI disappears without a reload.
  const expMs = tokenExpiryMs(readToken());
  const delay = expMs === null ? -1 : expMs - Date.now() + 50;
  const timer = delay > 0 && delay < 2_147_483_647 ? window.setTimeout(onChange, delay) : undefined;
  return () => {
    window.removeEventListener('storage', handler);
    if (timer !== undefined) window.clearTimeout(timer);
  };
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
