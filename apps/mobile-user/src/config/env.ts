import Constants from 'expo-constants';

/**
 * Backend origin for REST auth endpoints. Resolution order:
 *  1. EXPO_PUBLIC_API_URL (build-time env)
 *  2. expo `extra.apiUrl` from app.json
 * A trailing `/graphql` is stripped so one value serves both GraphQL and REST.
 * No hard-coded fallback: a missing value fails fast.
 */
export function normalizeBaseUrl(raw: string | undefined | null, allowInsecure = false): string {
  const value = (raw ?? '').trim();
  if (!value) {
    throw new Error('EXPO_PUBLIC_API_URL (یا extra.apiUrl) تنظیم نشده است');
  }
  const base = value.replace(/\/+$/, '').replace(/\/graphql$/i, '');
  // Tokens and passwords travel over this origin: plain http only in dev builds.
  if (!/^https:\/\//i.test(base) && !(allowInsecure && /^http:\/\//i.test(base))) {
    throw new Error('آدرس API باید با https شروع شود');
  }
  return base;
}

function isDevBuild(): boolean {
  return (globalThis as { __DEV__?: boolean }).__DEV__ === true;
}

export function getApiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined;
  return normalizeBaseUrl(process.env.EXPO_PUBLIC_API_URL || extra?.apiUrl, isDevBuild());
}
