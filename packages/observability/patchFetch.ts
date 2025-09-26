/**
 * Monkey-patch global fetch to add tracing automatically
 */
import { startSpan } from './trace';

declare const global: any;
const g: any = (typeof window!=='undefined'? window : (typeof global!=='undefined'? global : {}));

if(!g.__AV_FETCH_PATCHED__ && typeof g.fetch === 'function'){
  const orig = g.fetch.bind(g);
  g.fetch = async (input: RequestInfo | URL, init?: RequestInit)=>{
    const url = String((input as any)?.url || input);
    const span = startSpan('fetch', { url, method: (init?.method||'GET') });
    try{
      const res = await orig(input as any, init);
      span.end('ok');
      return res;
    }catch(e){
      span.end('error', e);
      throw e;
    }
  };
  g.__AV_FETCH_PATCHED__ = true;
}
