/** Async utilities — backend (Phase 4 — Step 20) */
export function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function withTimeout<T>(p: Promise<T>, ms: number, reason = 'Timeout'): Promise<T> {
  let t: any;
  const timeout = new Promise<never>((_, rej) => { t = setTimeout(() => rej(new Error(reason)), ms); });
  try { return await Promise.race([p, timeout]); } finally { clearTimeout(t); }
}

export async function retry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 200): Promise<T> {
  let last: any;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); } catch (e) { last = e; if (i < attempts - 1) await sleep(delayMs); }
  }
  throw last;
}

export async function to<T>(p: Promise<T>): Promise<[Error|null, T|null]> {
  try { const v = await p; return [null, v]; } catch (e: any) { return [e instanceof Error ? e : new Error(String(e)), null]; }
}

export async function pAllChunked<T>(factories: Array<() => Promise<T>>, chunk = 5): Promise<T[]> {
  const out: T[] = [];
  for (let i = 0; i < factories.length; i += chunk) {
    const slice = factories.slice(i, i + chunk);
    const results = await Promise.all(slice.map((f) => f()));
    out.push(...results);
  }
  return out;
}


export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const ret: R[] = [];
  let i = 0;
  let active = 0;
  return await new Promise<R[]>((resolve, reject) => {
    const next = () => {
      if (i >= items.length && active === 0) return resolve(ret);
      while (active < limit && i < items.length) {
        const idx = i++; const it = items[idx]; active++;
        Promise.resolve(fn(it, idx))
          .then((r) => { ret[idx] = r; active--; next(); })
          .catch((e) => reject(e));
      }
    };
    next();
  });
}

export class Semaphore {
  private queue: Array<() => void> = [];
  private value: number;
  constructor(private readonly max: number) { this.value = max; }
  async acquire(): Promise<() => void> {
    return await new Promise((resolve) => {
      const tryAcquire = () => {
        if (this.value > 0) { this.value--; resolve(() => this.release()); }
        else this.queue.push(tryAcquire);
      };
      tryAcquire();
    });
  }
  private release() {
    this.value++;
    const next = this.queue.shift();
    if (next) next();
  }
}
