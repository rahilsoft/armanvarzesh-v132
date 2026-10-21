import { ADMIN_TOKEN_KEY, type AdminRole } from '../rbac/session';

export type AdminLoginResult = { token: string; role: AdminRole };

export type LoginErrorCode = 'invalid' | 'throttled' | 'server' | 'network' | 'bad_response';

export class AdminLoginError extends Error {
  constructor(public readonly code: LoginErrorCode, message: string) {
    super(message);
    this.name = 'AdminLoginError';
  }
}

export const LOGIN_ERROR_MESSAGES: Record<LoginErrorCode, string> = {
  invalid: 'نام کاربری یا رمز عبور اشتباه است',
  throttled: 'تعداد تلاش‌ها زیاد است، یک دقیقه بعد دوباره امتحان کنید',
  server: 'خطای سرور رخ داد، کمی بعد دوباره تلاش کنید',
  network: 'ارتباط با سرور برقرار نشد، اتصال اینترنت را بررسی کنید',
  bad_response: 'پاسخ نامعتبر از سرور دریافت شد',
};

const ROLES: readonly string[] = ['owner', 'coach', 'support'];

/**
 * Backend origin. `VITE_API_BASE_URL` wins, otherwise the origin of `VITE_GRAPHQL_API`
 * (REST `/admin/login` lives next to `/graphql`, no global prefix).
 */
export function resolveApiBase(env: { VITE_API_BASE_URL?: string; VITE_GRAPHQL_API?: string }): string {
  const explicit = env.VITE_API_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const gql = env.VITE_GRAPHQL_API?.trim();
  if (gql) {
    try {
      return new URL(gql).origin;
    } catch {
      /* relative GraphQL URL: same origin */
    }
  }
  return '';
}

export async function adminLogin(
  baseUrl: string,
  credentials: { username: string; password: string },
  fetchImpl: typeof fetch = fetch,
): Promise<AdminLoginResult> {
  let res: Response;
  try {
    res = await fetchImpl(`${baseUrl}/admin/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(credentials),
    });
  } catch {
    throw new AdminLoginError('network', LOGIN_ERROR_MESSAGES.network);
  }
  if (res.status === 401 || res.status === 400) throw new AdminLoginError('invalid', LOGIN_ERROR_MESSAGES.invalid);
  if (res.status === 429) throw new AdminLoginError('throttled', LOGIN_ERROR_MESSAGES.throttled);
  if (!res.ok) throw new AdminLoginError('server', LOGIN_ERROR_MESSAGES.server);
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new AdminLoginError('bad_response', LOGIN_ERROR_MESSAGES.bad_response);
  }
  const d = data as { token?: unknown; role?: unknown } | null;
  if (!d || typeof d.token !== 'string' || !d.token || typeof d.role !== 'string' || !ROLES.includes(d.role)) {
    throw new AdminLoginError('bad_response', LOGIN_ERROR_MESSAGES.bad_response);
  }
  return { token: d.token, role: d.role as AdminRole };
}

export function storeToken(token: string, storage: Pick<Storage, 'setItem'> = window.localStorage): void {
  storage.setItem(ADMIN_TOKEN_KEY, token);
}

/** Logout: drop the token. Other tabs are notified via the `storage` event. */
export function logout(storage: Pick<Storage, 'removeItem'> = window.localStorage): void {
  try {
    storage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    /* storage unavailable: nothing to clear */
  }
}

/** Only same-app absolute paths are valid redirect targets (no open redirect). */
export function safeRedirect(from: unknown, fallback = '/dashboard'): string {
  if (typeof from !== 'string') return fallback;
  if (!from.startsWith('/') || from.startsWith('//') || from.startsWith('/login')) return fallback;
  return from;
}
