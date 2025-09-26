import { create } from 'zustand';
type Role = 'guest' | 'user' | 'coach' | 'admin';
interface AuthState { token: string | null; role: Role; setToken: (token: string | null) => void; setRole: (role: Role) => void; logout: () => void; }
export const useAuthStore = create<AuthState>((set) => ({ token: null, role: 'guest', setToken: (token) => set({ token }), setRole: (role) => set({ role }), logout: () => set({ token: null, role: 'guest' }) }));
