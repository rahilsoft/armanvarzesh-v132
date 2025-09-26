import { logInfo, logError } from '../observability/logger';
export async function fetcher(input: RequestInfo | URL, init?: RequestInit){
  const trace = Math.random().toString(16).slice(2);
  const headers = new Headers(init?.headers || {});
  headers.set('X-Trace-Id', trace);
  try{
    const res = await fetch(input, { ...(init||{}), headers });
    logInfo('http_response', { trace, status: res.status, url: String(input) });
    return res;
  }catch(e:any){
    logError('http_error', { trace, url: String(input), error: String(e) });
    throw e;
  }
}
