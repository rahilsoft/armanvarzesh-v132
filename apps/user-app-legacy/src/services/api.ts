import { createApiClient } from '@arman/http-client';

let token: string | null = null;
export function setAuthToken(t: string | null) { token = t; }

export const api = createApiClient({
  baseURL: process.env.EXPO_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_BASE,
  getToken: () => token,
  onRefreshToken: async () => null, // TODO: implement refresh -> setAuthToken(newToken); return newToken;
});

// Example call:
// const me = await api.get('/me');


export async function refreshAuthToken(): Promise<string | null> {
  try {
    // Pull refreshToken from store dynamically (to avoid cycle)
    const { authStore } = await import('@arman/state');
    const rt = authStore.getState().refreshToken;
    if (!rt) return null;
    const res = await api.post('/auth/refresh', { refreshToken: rt });
    const tokens: any = res.data || res; // handle axios .data normalization
    if (tokens?.accessToken) {
      const { setToken, setRefreshToken } = authStore.getState();
      setToken(tokens.accessToken);
      if (tokens.refreshToken) setRefreshToken(tokens.refreshToken);
      setAuthToken(tokens.accessToken);
      return tokens.accessToken as string;
    }
    return null;
  } catch {
    return null;
  }
}
