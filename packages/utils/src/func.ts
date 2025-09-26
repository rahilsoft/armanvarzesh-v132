export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 300, leading = false) {
  let t: ReturnType<typeof setTimeout> | null = null;
  let called = false;
  return (...args: Parameters<T>) => {
    if (leading && !called) { called = true; fn(...args); }
    if (t) clearTimeout(t);
    t = setTimeout(() => { called = false; fn(...args); }, wait);
  };
}

export function rateLimit(minIntervalMs = 600) {
  let last = 0;
  return () => {
    const now = Date.now();
    if (now - last < minIntervalMs) return false;
    last = now; return true;
  };
}
