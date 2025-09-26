/**
 * Lightweight tracer for browser/app — emits spans to console and localStorage.
 * Not a full OTEL impl; shaped to be replaceable by @opentelemetry/api.
 */
export type Span = {
  id: string;
  name: string;
  start: number;
  end?: number;
  attrs?: Record<string, any>;
  status?: 'ok'|'error';
  error?: string;
};
const storeKey = 'av_traces';
function now(){ return (typeof performance!=='undefined' && performance.now)? performance.now() : Date.now(); }
function rid(){ return Math.random().toString(16).slice(2); }

export function startSpan(name: string, attrs?: Record<string, any>){
  const span: Span = { id: rid(), name, start: now(), attrs };
  return {
    end: (status: 'ok'|'error' = 'ok', err?: any) => {
      span.end = now();
      span.status = status;
      if(err) span.error = String(err?.message||err);
      try {
        const arr = JSON.parse(localStorage.getItem(storeKey)||'[]');
        arr.push({ ...span, t: new Date().toISOString() });
        // cap to last 500
        while(arr.length>500) arr.shift();
        localStorage.setItem(storeKey, JSON.stringify(arr));
      } catch {}
      if(typeof console!=='undefined'){
        const dur = (span.end - span.start).toFixed(1);
        if(status==='ok') console.log(`[trace] ${span.name} ${dur}ms`, span.attrs||{});
        else console.warn(`[trace] ${span.name} ERROR ${dur}ms`, span.error, span.attrs||{});
      }
      return span;
    }
  };
}

export function getRecentTraces(limit=200){
  try{ const arr = JSON.parse(localStorage.getItem(storeKey)||'[]'); return arr.slice(-limit); } catch { return []; }
}

export async function traced<T>(name: string, fn: ()=> Promise<T>, attrs?: Record<string, any>): Promise<T>{
  const s = startSpan(name, attrs);
  try {
    const res = await fn();
    s.end('ok');
    return res;
  } catch (e){
    s.end('error', e);
    throw e;
  }
}
