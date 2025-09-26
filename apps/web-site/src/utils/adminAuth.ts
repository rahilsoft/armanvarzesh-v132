export function getAdminTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(/(?:^|; )admin_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
export function authHeaders(): HeadersInit {
  const t = getAdminTokenFromCookie();
  return t ? { Authorization: 'Bearer ' + t } : {};
}
