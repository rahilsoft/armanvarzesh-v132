export function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function withTimeout<T>(p: Promise<T>, ms: number, reason = 'Timeout'): Promise<T> {
  let t: any;
  const timeout = new Promise<never>((_, rej) => { t = setTimeout(() => rej(new Error(reason)), ms); });
  try { return await Promise.race([p, timeout]); } finally { clearTimeout(t); }
}

export async function to<T>(p: Promise<T>): Promise<[Error|null, T|null]> {
  try { const v = await p; return [null, v]; } catch (e: any) { return [e instanceof Error ? e : new Error(String(e)), null]; }
}
