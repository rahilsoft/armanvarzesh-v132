// Observability init (Phase D)
// Correlation ID + fetch wrapper + breadcrumbs
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

const g: any = global as any;

// Stable session-level correlation id
export const sessionId: string = g.__SESSION_ID__ || (g.__SESSION_ID__ = Math.random().toString(36).slice(2) + Date.now());

// Attach app context to Sentry
try {
  Sentry.setContext?.('app', {
    sessionId,
    version: (Constants?.expoConfig as any)?.version || '0.0.0',
    releaseChannel: (Constants?.expoConfig as any)?.releaseChannel || 'dev',
    runtime: 'expo'
  });
} catch {}

// Patch global fetch to add correlation headers and breadcrumbs
if (!g.__FETCH_OBS_PATCHED__) {
  g.__FETCH_OBS_PATCHED__ = true;
  const origFetch = g.fetch;
  g.fetch = async (input: RequestInfo, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : (input as Request).url;
    const started = Date.now();
    const reqId = `${sessionId}-${started}`;
    const headers = new Headers(init?.headers || {});
    headers.set('X-Request-Id', reqId);
    headers.set('X-Correlation-Id', sessionId);
    const nextInit: RequestInit = { ...init, headers };
    try {
      const res = await origFetch(input as any, nextInit);
      const dur = Date.now() - started;
      Sentry.addBreadcrumb?.({
        category: 'fetch',
        message: url,
        level: 'info',
        data: { status: res.status, dur, reqId }
      });
      return res;
    } catch (err) {
      const dur = Date.now() - started;
      Sentry.captureException?.(err as any, { tags: { phase: 'PhaseD' }, extra: { url, dur, reqId } });
      throw err;
    }
  };
}
