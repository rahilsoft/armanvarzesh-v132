import { createApiClient } from '@arman/http-client';

export const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  getToken: () => null, // TODO: wire with auth cookie/session if needed
  onRefreshToken: async () => null,
});


export async function refreshAuthToken(): Promise<string | null> {
  const { authStore } = await import('@arman/state');
  const rt = authStore.getState().refreshToken;
  if (!rt) return null;
  try {
    const res = await api.post('/auth/refresh', { refreshToken: rt });
    const tokens: any = res.data || res;
    if (tokens?.accessToken) {
      const { setToken, setRefreshToken } = authStore.getState();
      setToken(tokens.accessToken);
      if (tokens.refreshToken) setRefreshToken(tokens.refreshToken);
      // If you attach header globally, set here (CSR only)
      api.defaults.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      return tokens.accessToken as string;
    }
  } catch {}
  return null;
}
