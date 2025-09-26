export async function withRetry<T>(fn: () => Promise<T>, retries = 3, baseDelayMs = 200): Promise<T> {
  let attempt = 0;
  let lastErr: any;
  while (attempt <= retries) {
    try { return await fn(); } 
    catch (e) { lastErr = e; await new Promise(r => setTimeout(r, baseDelayMs * Math.pow(2, attempt))); attempt++; }
  }
  throw lastErr;
}
