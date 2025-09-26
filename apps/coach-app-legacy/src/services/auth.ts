import { api } from './api';
import { authStore } from '@arman/state';

export async function login(username: string, password: string) {
  const res = await api.post('/auth/login', { username, password });
  const data: any = res.data || res;
  const { setToken, setRefreshToken, setUser } = authStore.getState();
  setToken(data.accessToken);
  if (data.refreshToken) setRefreshToken(data.refreshToken);
  setUser({ username });
  return data;
}

export function logout() {
  const { setToken, setRefreshToken, logout: storeLogout } = authStore.getState();
  setToken(null); setRefreshToken?.(null); storeLogout();
}
