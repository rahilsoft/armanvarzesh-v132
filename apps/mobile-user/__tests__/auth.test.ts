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
const secure: Record<string, string> = {};
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(async (k: string, v: string) => {
    secure[k] = v;
  }),
  getItemAsync: jest.fn(async (k: string) => (k in secure ? secure[k] : null)),
  deleteItemAsync: jest.fn(async (k: string) => {
    delete secure[k];
  }),
}));
jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { extra: {} } } }));

import * as authApi from '../src/api/authApi';
import { normalizeBaseUrl } from '../src/config/env';
import { useAuthStore, SESSION_KEY, ACCESS_KEY, REFRESH_KEY, PROFILE_KEY, LEGACY_TOKEN_KEY } from '../src/store/authStore';

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
  for (const k of Object.keys(secure)) delete secure[k];
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
    expect(secure[ACCESS_KEY]).toBe('acc.jwt.value');
    expect(secure[REFRESH_KEY]).toBe('selector.verifier-token');
    // no secrets in AsyncStorage
    expect(JSON.stringify(mem)).not.toContain('selector.verifier-token');
    expect(JSON.stringify(mem)).not.toContain('acc.jwt.value');

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
    expect(secure[REFRESH_KEY]).toBeUndefined();
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

  function deferredFetch() {
    let resolve!: (r: unknown) => void;
    const p = new Promise((r) => {
      resolve = r;
    });
    (global as any).fetch = jest.fn(() => p);
    return () =>
      resolve({
        ok: true,
        status: 200,
        json: async () => ({ ...backendBody, accessToken: 'renewed-access', refreshToken: 'renewed-refresh' }),
      });
  }
  const userA = { id: '7', name: 'n', email: 'a@b.com' };

  it('stale refresh resolving after signOut does not restore the session', async () => {
    useAuthStore.setState({ token: 'old', refreshToken: 'r1', user: userA });
    const finish = deferredFetch();
    const pending = useAuthStore.getState().refreshSession();
    await useAuthStore.getState().signOut();
    const ss = jest.requireMock('expo-secure-store');
    ss.setItemAsync.mockClear();
    finish();
    expect(await pending).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
    expect(ss.setItemAsync).not.toHaveBeenCalled();
    expect(secure[ACCESS_KEY]).toBeUndefined();
  });

  it('stale refresh resolving after account switch keeps the new account', async () => {
    useAuthStore.setState({ token: 'old', refreshToken: 'r1', user: userA });
    const finish = deferredFetch();
    const pending = useAuthStore.getState().refreshSession();
    await useAuthStore.getState().signIn({
      accessToken: 'b-access',
      refreshToken: 'b-refresh',
      refreshExpiresAt: null,
      user: { id: '9', name: 'b', email: 'b@b.com' },
    });
    finish();
    expect(await pending).toBe(false);
    expect(useAuthStore.getState().token).toBe('b-access');
    expect(useAuthStore.getState().user?.id).toBe('9');
    expect(secure[ACCESS_KEY]).toBe('b-access');
    expect(secure[REFRESH_KEY]).toBe('b-refresh');
  });

  it('hydrate drops a session whose refresh token expired', async () => {
    secure[ACCESS_KEY] = 'a';
    secure[REFRESH_KEY] = 'r';
    mem[PROFILE_KEY] = JSON.stringify({ refreshExpiresAt: '2000-01-01T00:00:00.000Z', user: { id: '7', name: 'n', email: 'a@b.com' } });
    await useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('rejects plain http base URL unless dev build', () => {
    expect(() => normalizeBaseUrl('http://api.example.com/graphql')).toThrow();
    expect(normalizeBaseUrl('http://10.0.2.2:3000', true)).toBe('http://10.0.2.2:3000');
  });
});

describe('secure token storage', () => {
  const user = { id: '7', name: 'n', email: 'a@b.com' };

  it('migrates legacy AsyncStorage tokens to SecureStore and deletes them', async () => {
    mem[SESSION_KEY] = JSON.stringify({
      accessToken: 'legacy.acc',
      refreshToken: 'legacy.refresh',
      refreshExpiresAt: '2099-01-01T00:00:00.000Z',
      user,
    });
    await useAuthStore.getState().hydrate();
    expect(secure[ACCESS_KEY]).toBe('legacy.acc');
    expect(secure[REFRESH_KEY]).toBe('legacy.refresh');
    expect(mem[SESSION_KEY]).toBeUndefined();
    expect(JSON.stringify(mem)).not.toContain('legacy.');
    expect(useAuthStore.getState().token).toBe('legacy.acc');
    expect(useAuthStore.getState().user).toEqual(user);

    // second hydrate reads from SecureStore only
    useAuthStore.setState({ token: null, refreshToken: null, user: null, hydrated: false });
    await useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().refreshToken).toBe('legacy.refresh');
  });

  it('deletes a corrupt legacy session blob and stays signed out', async () => {
    mem[SESSION_KEY] = '{"accessToken":"leak.acc","refreshTok';
    await useAuthStore.getState().hydrate();
    expect(mem[SESSION_KEY]).toBeUndefined();
    expect(JSON.stringify(mem)).not.toContain('leak.');
    expect(useAuthStore.getState().hydrated).toBe(true);
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('keeps legacy data if SecureStore write fails (no token loss)', async () => {
    const ss = jest.requireMock('expo-secure-store');
    ss.setItemAsync.mockRejectedValueOnce(new Error('keystore unavailable'));
    mem[SESSION_KEY] = JSON.stringify({ accessToken: 'a', refreshToken: 'r', refreshExpiresAt: null, user });
    await useAuthStore.getState().hydrate();
    expect(mem[SESSION_KEY]).toBeDefined();
    expect(useAuthStore.getState().hydrated).toBe(true);
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('always clears the legacy arman.auth.token key on hydrate', async () => {
    mem[LEGACY_TOKEN_KEY] = 'old-single-token';
    await useAuthStore.getState().hydrate();
    expect(mem[LEGACY_TOKEN_KEY]).toBeUndefined();
  });

  it('signOut clears SecureStore and AsyncStorage', async () => {
    mockFetch(200, backendBody);
    await useAuthStore.getState().signIn(await authApi.login('a@b.com', 'pw'));
    mem[LEGACY_TOKEN_KEY] = 'x';
    mem[SESSION_KEY] = 'y';
    await useAuthStore.getState().signOut();
    expect(secure[ACCESS_KEY]).toBeUndefined();
    expect(secure[REFRESH_KEY]).toBeUndefined();
    expect(Object.keys(mem)).toEqual([]);
    expect(useAuthStore.getState().token).toBeNull();
  });
});
