import { context, trace } from '@opentelemetry/api';

export type RetryPolicy = { retries: number; baseDelayMs: number; maxDelayMs: number; };
export type HttpOpts = { timeoutMs?: number; headers?: Record<string,string>; retry?: RetryPolicy };

function sleep(ms:number){ return new Promise(r=>setTimeout(r, ms)); }

export async function fetchWithRetry(url: string, init: RequestInit = {}, opts: HttpOpts = {}) {
  const retry = opts.retry ?? { retries: 3, baseDelayMs: 200, maxDelayMs: 2000 };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 10_000);
  const headers = { ...(opts.headers || {}), ...(init.headers || {}) };
  // propagate trace headers (if any)
  const span = trace.getActiveSpan();
  if (span) { headers['x-trace-id'] = span.spanContext().traceId; }
  let lastErr: any;
  for (let attempt=0; attempt<=retry.retries; attempt++) {
    try {
      const res = await fetch(url, { ...init, headers, signal: controller.signal });
      if (res.ok) { clearTimeout(timeout); return res; }
      lastErr = new Error(`HTTP ${res.status}`);
      if (res.status >= 500) throw lastErr;
      break; // 4xx → no retry
    } catch (e) {
      lastErr = e;
      if (attempt === retry.retries) break;
      const delay = Math.min(retry.maxDelayMs, retry.baseDelayMs * Math.pow(2, attempt));
      await sleep(delay);
    }
  }
  clearTimeout(timeout);
  throw lastErr;
}
