import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/authApi';
import type { AuthSession } from '../api/authApi';

// expo-secure-store is not a dependency of this app yet, so AsyncStorage is used.
export const SESSION_KEY = 'arman.auth.session';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type StoredSession = {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: string | null;
  user: AuthUser;
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

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  user: null,
  hydrated: false,

  signIn: async (session) => {
    const stored: StoredSession = {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      refreshExpiresAt: session.refreshExpiresAt,
      user: session.user,
    };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(stored));
    set({ token: session.accessToken, refreshToken: session.refreshToken, user: session.user });
  },

  signOut: async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    set({ token: null, refreshToken: null, user: null });
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(SESSION_KEY);
      const s = raw ? (JSON.parse(raw) as StoredSession) : null;
      if (s && s.accessToken && s.refreshToken) {
        set({ token: s.accessToken, refreshToken: s.refreshToken, user: s.user, hydrated: true });
        return;
      }
    } catch {
      // corrupt storage: treat as signed out
    }
    set({ token: null, refreshToken: null, user: null, hydrated: true });
  },

  refreshSession: async () => {
    const { refreshToken, user } = get();
    if (!refreshToken) return false;
    try {
      const session = await authApi.refresh(refreshToken, user?.name);
      await get().signIn(session);
      return true;
    } catch (e) {
      if (e instanceof authApi.AuthApiError && (e.status === 401 || e.status === 400)) {
        await get().signOut();
      }
      return false;
    }
  },
}));
