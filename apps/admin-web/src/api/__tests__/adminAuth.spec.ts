import {
  AdminLoginError,
  LOGIN_ERROR_MESSAGES,
  adminLogin,
  logout,
  resolveApiBase,
  safeRedirect,
  storeToken,
} from '../adminAuth';

const creds = { username: 'boss', password: 'secret1' };
const resp = (status: number, body?: unknown) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => body }) as unknown as Response;

describe('adminLogin', () => {
  it('success: posts JSON to /admin/login and returns token+role', async () => {
    const f = jest.fn().mockResolvedValue(resp(200, { token: 'a.b.c', role: 'owner' }));
    const out = await adminLogin('https://api.x', creds, f as unknown as typeof fetch);
    expect(out).toEqual({ token: 'a.b.c', role: 'owner' });
    const [url, init] = f.mock.calls[0];
    expect(url).toBe('https://api.x/admin/login');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual(creds);
  });

  it('401: Persian invalid credentials message', async () => {
    const f = jest.fn().mockResolvedValue(resp(401, {}));
    await expect(adminLogin('', creds, f as unknown as typeof fetch)).rejects.toMatchObject({
      code: 'invalid',
      message: 'نام کاربری یا رمز عبور اشتباه است',
    });
  });

  it('429: throttled', async () => {
    const f = jest.fn().mockResolvedValue(resp(429));
    await expect(adminLogin('', creds, f as unknown as typeof fetch)).rejects.toMatchObject({ code: 'throttled' });
  });

  it('500: server error', async () => {
    const f = jest.fn().mockResolvedValue(resp(500));
    await expect(adminLogin('', creds, f as unknown as typeof fetch)).rejects.toMatchObject({ code: 'server' });
  });

  it('network failure: Persian network message', async () => {
    const f = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    const err = await adminLogin('', creds, f as unknown as typeof fetch).catch((e) => e);
    expect(err).toBeInstanceOf(AdminLoginError);
    expect(err.message).toBe(LOGIN_ERROR_MESSAGES.network);
  });

  it('malformed 200 body: bad_response, unknown role rejected', async () => {
    for (const body of [{}, { token: 'x' }, { token: 'x', role: 'root' }, null]) {
      const f = jest.fn().mockResolvedValue(resp(200, body));
      await expect(adminLogin('', creds, f as unknown as typeof fetch)).rejects.toMatchObject({ code: 'bad_response' });
    }
  });

  it('messages never contain the Persian semicolon', () => {
    Object.values(LOGIN_ERROR_MESSAGES).forEach((m) => expect(m).not.toContain('؛'));
  });
});

describe('token storage', () => {
  it('stores under admin_token and logout clears it', () => {
    const data: Record<string, string> = {};
    const storage = {
      setItem: (k: string, v: string) => void (data[k] = v),
      removeItem: (k: string) => void delete data[k],
    };
    storeToken('t', storage);
    expect(data).toEqual({ admin_token: 't' });
    logout(storage);
    expect(data).toEqual({});
  });
});

describe('resolveApiBase / safeRedirect', () => {
  it('prefers VITE_API_BASE_URL, else origin of GraphQL url, else same origin', () => {
    expect(resolveApiBase({ VITE_API_BASE_URL: 'https://a.io/', VITE_GRAPHQL_API: 'https://b.io/graphql' })).toBe('https://a.io');
    expect(resolveApiBase({ VITE_GRAPHQL_API: 'https://b.io/graphql' })).toBe('https://b.io');
    expect(resolveApiBase({})).toBe('');
  });
  it('only allows local absolute paths', () => {
    expect(safeRedirect('/payments?x=1')).toBe('/payments?x=1');
    expect(safeRedirect('//evil.com')).toBe('/dashboard');
    expect(safeRedirect('https://evil.com')).toBe('/dashboard');
    expect(safeRedirect('/login')).toBe('/dashboard');
    expect(safeRedirect('/\\evil.com')).toBe('/dashboard');
    expect(safeRedirect('/\t/evil.com')).toBe('/dashboard');
    expect(safeRedirect('/\n/evil.com')).toBe('/dashboard');
    expect(safeRedirect(undefined)).toBe('/dashboard');
  });
});
