import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as authApi from '../api/authApi';
import type { AuthSession } from '../api/authApi';

// Tokens live in the OS keystore (SecureStore). AsyncStorage keeps only non-secret profile data.
export const ACCESS_KEY = 'arman.auth.access';
export const REFRESH_KEY = 'arman.auth.refresh';
export const PROFILE_KEY = 'arman.auth.profile';
/** Pre-SecureStore blob that held tokens + profile together. Migrated and deleted on hydrate. */
export const SESSION_KEY = 'arman.auth.session';
/** Oldest legacy single-token key. Always deleted. */
export const LEGACY_TOKEN_KEY = 'arman.auth.token';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type StoredProfile = {
  refreshExpiresAt: string | null;
  user: AuthUser;
};

type LegacySession = StoredProfile & {
  accessToken?: string;
  refreshToken?: string;
};

type AuthState = {
  /** Access token (used by the Apollo auth link and navigation gate). */
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  signIn: (session: AuthSession) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
  /** Rotates tokens via the backend. Signs out when the refresh token is rejected. */
  refreshSession: () => Promise<boolean>;
};

// Single-flight: the backend treats reuse of a rotated refresh token as theft and
// revokes every session, so concurrent 401s must share one refresh call.
let inflightRefresh: Promise<boolean> | null = null;

// Session generation: bumped by every signIn/signOut. A refresh captures it at start and
// discards its result if it changed (sign-out or account switch while the call was in flight).
let sessionGeneration = 0;

// Every session write and clear runs through one queue, in call order. A stale refresh checks
// the generation inside its queued step, so its writes can never land after a later sign-out
// or after another account's sign-in has been queued.
let storageQueue: Promise<unknown> = Promise.resolve();
function enqueueStorage<T>(op: () => Promise<T>): Promise<T> {
  const next = storageQueue.then(op, op);
  storageQueue = next.catch(() => undefined);
  return next;
}

function isExpired(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const t = Date.parse(iso);
  return Number.isFinite(t) && t <= Date.now();
}

async function persistSession(session: AuthSession): Promise<void> {
  const profile: StoredProfile = { refreshExpiresAt: session.refreshExpiresAt, user: session.user };
  await SecureStore.setItemAsync(ACCESS_KEY, session.accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, session.refreshToken);
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  // Drop any leftovers from older builds.
  await AsyncStorage.removeItem(SESSION_KEY);
  await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  user: null,
  hydrated: false,

  signIn: async (session) => {
    sessionGeneration += 1;
    await enqueueStorage(() => persistSession(session));
    set({ token: session.accessToken, refreshToken: session.refreshToken, user: session.user });
  },

  signOut: async () => {
    sessionGeneration += 1;
    set({ token: null, refreshToken: null, user: null });
    await enqueueStorage(() =>
      Promise.all([
        SecureStore.deleteItemAsync(ACCESS_KEY),
        SecureStore.deleteItemAsync(REFRESH_KEY),
        AsyncStorage.removeItem(PROFILE_KEY),
        AsyncStorage.removeItem(SESSION_KEY),
        AsyncStorage.removeItem(LEGACY_TOKEN_KEY),
      ]),
    );
    set({ token: null, refreshToken: null, user: null });
  },

  hydrate: async () => {
    try {
      await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);

      // One-time migration: tokens used to be stored in AsyncStorage.
      const legacyRaw = await AsyncStorage.getItem(SESSION_KEY);
      if (legacyRaw) {
        let legacy: LegacySession | null = null;
        try {
          legacy = JSON.parse(legacyRaw) as LegacySession;
        } catch {
          // Corrupt blob: never leave a token-bearing leftover behind.
          await AsyncStorage.removeItem(SESSION_KEY);
        }
        if (legacy) {
          if (legacy.accessToken && legacy.refreshToken) {
            await SecureStore.setItemAsync(ACCESS_KEY, legacy.accessToken);
            await SecureStore.setItemAsync(REFRESH_KEY, legacy.refreshToken);
            const profile: StoredProfile = { refreshExpiresAt: legacy.refreshExpiresAt, user: legacy.user };
            await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
          }
          // Only reached after the SecureStore writes succeeded (they throw otherwise).
          await AsyncStorage.removeItem(SESSION_KEY);
        }
      }

      const [accessToken, refreshToken, rawProfile] = await Promise.all([
        SecureStore.getItemAsync(ACCESS_KEY),
        SecureStore.getItemAsync(REFRESH_KEY),
        AsyncStorage.getItem(PROFILE_KEY),
      ]);
      const profile = rawProfile ? (JSON.parse(rawProfile) as StoredProfile) : null;
      if (accessToken && refreshToken && profile && !isExpired(profile.refreshExpiresAt)) {
        set({ token: accessToken, refreshToken, user: profile.user, hydrated: true });
        return;
      }
    } catch {
      // corrupt or unreadable storage: treat as signed out
    }
    set({ token: null, refreshToken: null, user: null, hydrated: true });
  },

  refreshSession: () => {
    if (inflightRefresh) return inflightRefresh;
    inflightRefresh = (async () => {
      const { refreshToken, user } = get();
      if (!refreshToken) return false;
      const generation = sessionGeneration;
      try {
        const session = await authApi.refresh(refreshToken, user?.name);
        if (generation !== sessionGeneration) return false;
        const written = await enqueueStorage(async () => {
          if (generation !== sessionGeneration) return false;
          await persistSession(session);
          return true;
        });
        if (!written || generation !== sessionGeneration) return false;
        set({ token: session.accessToken, refreshToken: session.refreshToken, user: session.user });
        return true;
      } catch (e) {
        if (generation !== sessionGeneration) return false;
        if (e instanceof authApi.AuthApiError && (e.status === 401 || e.status === 400)) {
          await get().signOut();
        }
        return false;
      }
    })().finally(() => {
      inflightRefresh = null;
    });
    return inflightRefresh;
  },
}));
