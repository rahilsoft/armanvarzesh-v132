import Constants from 'expo-constants';

/**
 * Backend origin for REST auth endpoints. Resolution order:
 *  1. EXPO_PUBLIC_API_URL (build-time env)
 *  2. expo `extra.apiUrl` from app.json
 * A trailing `/graphql` is stripped so one value serves both GraphQL and REST.
 * No hard-coded fallback: a missing value fails fast.
 */
export function normalizeBaseUrl(raw: string | undefined | null): string {
  const value = (raw ?? '').trim();
  if (!value) {
    throw new Error('EXPO_PUBLIC_API_URL (یا extra.apiUrl) تنظیم نشده است');
  }
  return value.replace(/\/+$/, '').replace(/\/graphql$/i, '');
}

export function getApiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined;
  return normalizeBaseUrl(process.env.EXPO_PUBLIC_API_URL || extra?.apiUrl);
}
