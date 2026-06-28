import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'arman.auth.token';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  signIn: (token: string, user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  signIn: async (token, user) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    set({ token, user });
  },

  signOut: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null });
  },

  hydrate: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    set({ token: token ?? null, hydrated: true });
  },
}));
