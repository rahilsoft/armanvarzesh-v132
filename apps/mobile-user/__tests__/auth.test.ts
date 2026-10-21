import * as fs from 'fs';
import * as path from 'path';

const mem: Record<string, string> = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(async (k: string, v: string) => {
      mem[k] = v;
    }),
    getItem: jest.fn(async (k: string) => (k in mem ? mem[k] : null)),
    removeItem: jest.fn(async (k: string) => {
      delete mem[k];
    }),
  },
}));
jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { extra: {} } } }));

import * as authApi from '../src/api/authApi';
import { normalizeBaseUrl } from '../src/config/env';
import { useAuthStore, SESSION_KEY } from '../src/store/authStore';

const backendBody = {
  user: { id: 7, email: 'a@b.com' },
  accessToken: 'acc.jwt.value',
  refreshToken: 'selector.verifier-token',
  refreshExpiresAt: '2026-11-20T00:00:00.000Z',
};

function mockFetch(status: number, body: unknown) {
  const fn = jest.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }));
  (global as any).fetch = fn;
  return fn;
}

beforeEach(() => {
  process.env.EXPO_PUBLIC_API_URL = 'https://api.test/graphql';
  for (const k of Object.keys(mem)) delete mem[k];
  useAuthStore.setState({ token: null, refreshToken: null, user: null, hydrated: false });
});

describe('env', () => {
  it('strips /graphql and trailing slash, fails fast when empty', () => {
    expect(normalizeBaseUrl('https://x.io/graphql')).toBe('https://x.io');
    expect(normalizeBaseUrl('https://x.io/')).toBe('https://x.io');
    expect(() => normalizeBaseUrl('')).toThrow();
  });
});

describe('authApi', () => {
  it('login posts to /auth/login and maps session', async () => {
    const f = mockFetch(200, backendBody);
    const s = await authApi.login(' a@b.com ', 'pw');
    expect(f).toHaveBeenCalledWith(
      'https://api.test/auth/login',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'a@b.com', password: 'pw' }) }),
    );
    expect(s.accessToken).toBe('acc.jwt.value');
    expect(s.refreshToken).toBe('selector.verifier-token');
    expect(s.user).toEqual({ id: '7', email: 'a@b.com', name: 'a' });
  });

  it('register sends name and keeps it', async () => {
    const f = mockFetch(201, backendBody);
    const s = await authApi.register('علی', 'a@b.com', 'password1');
    expect(JSON.parse((f.mock.calls[0] as any)[1].body)).toEqual({
      email: 'a@b.com',
      password: 'password1',
      name: 'علی',
    });
    expect(s.user.name).toBe('علی');
  });

  it('surfaces Persian message on 401 / 409 / 429 / 500', async () => {
    mockFetch(401, {});
    await expect(authApi.login('a@b.com', 'x')).rejects.toThrow('ایمیل یا رمز عبور اشتباه است');
    mockFetch(409, {});
    await expect(authApi.register('n', 'a@b.com', 'password1')).rejects.toThrow('این ایمیل قبلاً ثبت شده است');
    mockFetch(429, {});
    await expect(authApi.login('a@b.com', 'x')).rejects.toThrow('تعداد تلاش');
    mockFetch(500, {});
    await expect(authApi.login('a@b.com', 'x')).rejects.toThrow('خطای سرور');
  });

  it('network failure gives Persian message', async () => {
    (global as any).fetch = jest.fn(async () => {
      throw new Error('net');
    });
    await expect(authApi.login('a@b.com', 'x')).rejects.toThrow('اتصال به سرور');
  });

  it('rejects malformed success body (no tokens)', async () => {
    mockFetch(200, { user: { id: 1, email: 'a@b.com' } });
    await expect(authApi.login('a@b.com', 'x')).rejects.toBeInstanceOf(authApi.AuthApiError);
  });

  it('validation messages', () => {
    expect(authApi.validateLogin('', 'x')).toBe('ایمیل را وارد کنید');
    expect(authApi.validateLogin('bad', 'x')).toBe('ایمیل واردشده معتبر نیست');
    expect(authApi.validateLogin('a@b.com', '')).toBe('رمز عبور را وارد کنید');
    expect(authApi.validateLogin('a@b.com', 'x')).toBeNull();
    expect(authApi.validateRegister('n', 'a@b.com', 'short')).toContain('۸');
    expect(authApi.validateRegister('', 'a@b.com', 'password1')).toContain('نام');
  });
});

describe('authStore', () => {
  it('signIn stores access+refresh tokens, hydrate restores them', async () => {
    const s = await (async () => {
      mockFetch(200, backendBody);
      return authApi.login('a@b.com', 'pw');
    })();
    await useAuthStore.getState().signIn(s);
    expect(useAuthStore.getState().token).toBe('acc.jwt.value');
    expect(JSON.parse(mem[SESSION_KEY]).refreshToken).toBe('selector.verifier-token');

    useAuthStore.setState({ token: null, refreshToken: null, user: null, hydrated: false });
    await useAuthStore.getState().hydrate();
    const st = useAuthStore.getState();
    expect(st.hydrated).toBe(true);
    expect(st.token).toBe('acc.jwt.value');
    expect(st.refreshToken).toBe('selector.verifier-token');
    expect(st.user?.email).toBe('a@b.com');
  });

  it('hydrate with empty storage is signed out', async () => {
    await useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().hydrated).toBe(true);
  });

  it('refreshSession rotates tokens, signs out on 401', async () => {
    useAuthStore.setState({ token: 'old', refreshToken: 'old.refresh-token', user: { id: '7', email: 'a@b.com', name: 'a' } });
    mockFetch(200, { ...backendBody, accessToken: 'new.acc', refreshToken: 'new.refresh-token' });
    expect(await useAuthStore.getState().refreshSession()).toBe(true);
    expect(useAuthStore.getState().token).toBe('new.acc');

    mockFetch(401, {});
    expect(await useAuthStore.getState().refreshSession()).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
    expect(mem[SESSION_KEY]).toBeUndefined();
  });
});

describe('no demo auth path', () => {
  it('source has no demo-token or fake login', () => {
    const files: string[] = [];
    const walk = (d: string) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.tsx?$/.test(e.name)) files.push(p);
      }
    };
    walk(path.join(__dirname, '..', 'src'));
    for (const f of files) {
      expect(fs.readFileSync(f, 'utf8')).not.toMatch(/demo-token|TODO: replace with a real/);
    }
  });
});

describe('review hardening', () => {
  it('refreshSession is single-flight (no refresh-token reuse)', async () => {
    useAuthStore.setState({ token: 'old', refreshToken: 'r1', user: { id: '7', name: 'n', email: 'a@b.com' } });
    const f = mockFetch(200, backendBody);
    const [a, b] = await Promise.all([
      useAuthStore.getState().refreshSession(),
      useAuthStore.getState().refreshSession(),
    ]);
    expect(a).toBe(true);
    expect(b).toBe(true);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('hydrate drops a session whose refresh token expired', async () => {
    mem[SESSION_KEY] = JSON.stringify({ ...backendBody, refreshExpiresAt: '2000-01-01T00:00:00.000Z', user: { id: '7', name: 'n', email: 'a@b.com' } });
    await useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('rejects plain http base URL unless dev build', () => {
    expect(() => normalizeBaseUrl('http://api.example.com/graphql')).toThrow();
    expect(normalizeBaseUrl('http://10.0.2.2:3000', true)).toBe('http://10.0.2.2:3000');
  });
});
