/**
Disposal utilities
Small helpers to create and dispose timers/intervals and aggregate disposers, plus `newAbort()` to create AbortController/signal pairs.
*/
export type Disposer = () => void;

export function withTimeout(ms: number, fn: Function): Disposer {
  const t = setTimeout(() => fn(), ms);
  return () => clearTimeout(t);
}

export function withInterval(ms: number, fn: Function): Disposer {
  const t = setInterval(() => fn(), ms);
  return () => clearInterval(t);
}

export class Scope {
  private disposers: Disposer[] = [];
  add(d: Disposer | void | null) { if (typeof d === 'function') this.disposers.push(d); return d; }
  disposeAll() { for (const d of this.disposers.splice(0)) try { d(); } catch {} }
}

export function newAbort() {
  const controller = new AbortController();
  return { controller, signal: controller.signal };
}
