export async function prefetchImage(uri: string): Promise<boolean> {
  try {
    // Web
    if (typeof window !== 'undefined') {
      const resp = await fetch(uri, { method: 'HEAD', cache: 'force-cache' as RequestCache });
      return resp.ok;
    }
  } catch {}
  try {
    // RN Expo (if available)
    const { Image } = require('expo-image');
    if (Image?.prefetch) { await Image.prefetch(uri); return true; }
  } catch {}
  return false;
}
