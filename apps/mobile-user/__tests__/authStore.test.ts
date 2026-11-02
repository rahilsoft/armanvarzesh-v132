/**
 * REV-20261021-05: a token refresh that is still in flight when the user signs out, or when
 * another account signs in, must never write its result back to state or storage.
 */
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
jest.mock('../src/api/authApi', () => {
  const actual = jest.requireActual('../src/api/authApi');
  return { ...actual, refresh: jest.fn() };
});

import * as authApi from '../src/api/authApi';
import type { AuthSession } from '../src/api/authApi';
import { useAuthStore, ACCESS_KEY, REFRESH_KEY, PROFILE_KEY } from '../src/store/authStore';

const refreshMock = authApi.refresh as jest.MockedFunction<typeof authApi.refresh>;

function session(tag: string): AuthSession {
  return {
    accessToken: `access-${tag}`,
    refreshToken: `refresh-${tag}`,
    refreshExpiresAt: null,
    user: { id: `id-${tag}`, name: `user-${tag}`, email: `${tag}@example.com` },
  } as AuthSession;
}

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const flush = () => new Promise((r) => setImmediate(r));

beforeEach(async () => {
  refreshMock.mockReset();
  await useAuthStore.getState().signOut();
  for (const k of Object.keys(mem)) delete mem[k];
  for (const k of Object.keys(secure)) delete secure[k];
});

describe('authStore refresh vs sign-out and account switch', () => {
  it('a refresh resolved after sign-out leaves state and storage signed out', async () => {
    await useAuthStore.getState().signIn(session('A'));
    const d = deferred<AuthSession>();
    refreshMock.mockReturnValueOnce(d.promise);

    const pending = useAuthStore.getState().refreshSession();
    expect(refreshMock).toHaveBeenCalledWith('refresh-A', 'user-A');
    await useAuthStore.getState().signOut();
    d.resolve(session('A2'));

    await expect(pending).resolves.toBe(false);
    await flush();
    const s = useAuthStore.getState();
    expect(s.token).toBeNull();
    expect(s.refreshToken).toBeNull();
    expect(s.user).toBeNull();
    expect(secure[ACCESS_KEY]).toBeUndefined();
    expect(secure[REFRESH_KEY]).toBeUndefined();
    expect(mem[PROFILE_KEY]).toBeUndefined();
  });

  it("a refresh of account A resolved after B signed in keeps B's session", async () => {
    await useAuthStore.getState().signIn(session('A'));
    const d = deferred<AuthSession>();
    refreshMock.mockReturnValueOnce(d.promise);

    const pending = useAuthStore.getState().refreshSession();
    await useAuthStore.getState().signOut();
    await useAuthStore.getState().signIn(session('B'));
    d.resolve(session('A2'));

    await expect(pending).resolves.toBe(false);
    await flush();
    const s = useAuthStore.getState();
    expect(s.token).toBe('access-B');
    expect(s.refreshToken).toBe('refresh-B');
    expect(s.user?.id).toBe('id-B');
    expect(secure[ACCESS_KEY]).toBe('access-B');
    expect(secure[REFRESH_KEY]).toBe('refresh-B');
    expect(JSON.parse(mem[PROFILE_KEY]).user.id).toBe('id-B');
  });

  it("a 401 from A's stale refresh does not sign B out", async () => {
    await useAuthStore.getState().signIn(session('A'));
    const d = deferred<AuthSession>();
    refreshMock.mockReturnValueOnce(d.promise);

    const pending = useAuthStore.getState().refreshSession();
    await useAuthStore.getState().signIn(session('B'));
    d.reject(new authApi.AuthApiError('rejected', 401));

    await expect(pending).resolves.toBe(false);
    await flush();
    expect(useAuthStore.getState().token).toBe('access-B');
    expect(secure[REFRESH_KEY]).toBe('refresh-B');
  });

  it('B never joins the refresh that is still in flight for A', async () => {
    await useAuthStore.getState().signIn(session('A'));
    const dA = deferred<AuthSession>();
    const dB = deferred<AuthSession>();
    refreshMock.mockReturnValueOnce(dA.promise).mockReturnValueOnce(dB.promise);

    const pendingA = useAuthStore.getState().refreshSession();
    await useAuthStore.getState().signIn(session('B'));
    const pendingB = useAuthStore.getState().refreshSession();

    expect(pendingB).not.toBe(pendingA);
    expect(refreshMock).toHaveBeenNthCalledWith(2, 'refresh-B', 'user-B');
    dA.resolve(session('A2'));
    dB.resolve(session('B2'));
    await expect(pendingA).resolves.toBe(false);
    await expect(pendingB).resolves.toBe(true);
    expect(useAuthStore.getState().token).toBe('access-B2');
    expect(secure[REFRESH_KEY]).toBe('refresh-B2');
  });

  it('concurrent refreshes of one session share a single call (single-flight)', async () => {
    await useAuthStore.getState().signIn(session('A'));
    const d = deferred<AuthSession>();
    refreshMock.mockReturnValueOnce(d.promise);

    const p1 = useAuthStore.getState().refreshSession();
    const p2 = useAuthStore.getState().refreshSession();
    expect(p2).toBe(p1);
    expect(refreshMock).toHaveBeenCalledTimes(1);
    d.resolve(session('A2'));
    await expect(p1).resolves.toBe(true);
    expect(useAuthStore.getState().token).toBe('access-A2');
    expect(secure[ACCESS_KEY]).toBe('access-A2');
  });

  it('a 401 on the current session signs out and clears storage', async () => {
    await useAuthStore.getState().signIn(session('A'));
    refreshMock.mockRejectedValueOnce(new authApi.AuthApiError('rejected', 401));

    await expect(useAuthStore.getState().refreshSession()).resolves.toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
    expect(secure[ACCESS_KEY]).toBeUndefined();
    expect(mem[PROFILE_KEY]).toBeUndefined();
  });
});
