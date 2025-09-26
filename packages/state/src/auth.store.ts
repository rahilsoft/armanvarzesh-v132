import { create } from 'zustand';

export type AuthState = { refreshToken?: string | null;
  token: string | null;
  user?: any | null;
  setToken: (t: string | null) => void;
  setRefreshToken: (t: string | null) => void;
  setUser: (u: any | null) => void;
  logout: () => void;
};

/** Centralized auth store to avoid prop drilling and unsafe multi-updates. */
export const authStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  user: null,
  setToken: (t) => set({ token: t }),
  setRefreshToken: (t) => set({ refreshToken: t }),
  setUser: (u) => set({ user: u }),
  logout: () => set({ token: null, user: null }),
}));

/** Hook-compatible function (zustand create returns a hook with .getState/.setState) */
export const useAuthStore = authStore;
