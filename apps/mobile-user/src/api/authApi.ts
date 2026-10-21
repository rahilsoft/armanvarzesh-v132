import { getApiBaseUrl } from '../config/env';

/** Real backend: app/backend UserAuthController (`POST /auth/register|login|refresh`). */
export type AuthSession = {
  user: { id: string; email: string; name: string };
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: string | null;
};

export class AuthApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(email: string, password: string): string | null {
  if (!email.trim()) return 'ایمیل را وارد کنید';
  if (!EMAIL_RE.test(email.trim())) return 'ایمیل واردشده معتبر نیست';
  if (!password) return 'رمز عبور را وارد کنید';
  return null;
}

export function validateRegister(name: string, email: string, password: string): string | null {
  if (!name.trim()) return 'نام و نام خانوادگی را وارد کنید';
  const loginError = validateLogin(email, password);
  if (loginError) return loginError;
  if (password.length < 8) return 'رمز عبور باید دست‌کم ۸ نویسه باشد';
  return null;
}

type Kind = 'login' | 'register' | 'refresh';

function messageForStatus(status: number, kind: Kind): string {
  if (status === 401) {
    return kind === 'login'
      ? 'ایمیل یا رمز عبور اشتباه است'
      : 'نشست شما منقضی شده است، دوباره وارد شوید';
  }
  if (status === 409) return 'این ایمیل قبلاً ثبت شده است';
  if (status === 400 || status === 422) return 'اطلاعات واردشده معتبر نیست';
  if (status === 429) return 'تعداد تلاش‌ها زیاد بود، کمی بعد دوباره امتحان کنید';
  if (status >= 500) return 'خطای سرور، لطفاً بعداً دوباره تلاش کنید';
  return 'خطای نامشخص، دوباره تلاش کنید';
}

async function post(path: string, body: Record<string, unknown>, kind: Kind): Promise<any> {
  const url = `${getApiBaseUrl()}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AuthApiError('اتصال به سرور برقرار نشد، اینترنت خود را بررسی کنید', 0);
  }
  if (!res.ok) throw new AuthApiError(messageForStatus(res.status, kind), res.status);
  try {
    return await res.json();
  } catch {
    throw new AuthApiError('پاسخ نامعتبر از سرور دریافت شد', res.status);
  }
}

function toSession(data: any, fallbackName?: string): AuthSession {
  if (
    !data ||
    typeof data.accessToken !== 'string' ||
    typeof data.refreshToken !== 'string' ||
    !data.user
  ) {
    throw new AuthApiError('پاسخ نامعتبر از سرور دریافت شد', 200);
  }
  const email = String(data.user.email ?? '');
  return {
    user: {
      id: String(data.user.id),
      email,
      name: (data.user.name as string | undefined) || fallbackName || email.split('@')[0] || 'کاربر',
    },
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    refreshExpiresAt: data.refreshExpiresAt ? String(data.refreshExpiresAt) : null,
  };
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const data = await post('/auth/login', { email: email.trim(), password }, 'login');
  return toSession(data);
}

export async function register(name: string, email: string, password: string): Promise<AuthSession> {
  const data = await post(
    '/auth/register',
    { email: email.trim(), password, name: name.trim() },
    'register',
  );
  return toSession(data, name.trim());
}

export async function refresh(refreshToken: string, previousName?: string): Promise<AuthSession> {
  const data = await post('/auth/refresh', { refreshToken }, 'refresh');
  return toSession(data, previousName);
}
