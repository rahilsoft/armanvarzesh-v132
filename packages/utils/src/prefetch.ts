export async function prefetchImage(uri: string): Promise<boolean> {
  try {
    // Web
    if (typeof window !== 'undefined') {
      const resp = await fetch(uri, { method: 'HEAD', cache: 'force-cache' as RequestCache });
      return resp.ok;
    }
  } catch {}
  try {
    // RN Expo (if available). Resolve indirectly so web bundlers (webpack)
    // do not statically try to bundle the native-only 'expo-image' module.
    const req: NodeRequire | undefined = typeof require === 'function'
      ? (eval('require') as NodeRequire)
      : undefined;
    const { Image } = req ? req('expo-image') : ({} as any);
    if (Image?.prefetch) { await Image.prefetch(uri); return true; }
  } catch {}
  return false;
}
