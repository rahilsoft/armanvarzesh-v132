// Phase G — redact util
export function redactSensitive(input: any): any {
  const SENSITIVE = ['password','secret','token','authorization','apiKey','accessToken','refreshToken','card','email','phone'];
  const seen = new WeakSet();
  function walk(val: any): any {
    if (val === null || typeof val !== 'object') return val;
    if (seen.has(val)) return val;
    seen.add(val);
    if (Array.isArray(val)) return val.map(walk);
    const out: Record<string, any> = {};
    for (const [k,v] of Object.entries(val)) {
      if (SENSITIVE.some(s => k.toLowerCase().includes(s))) {
        out[k] = '[REDACTED]';
      } else {
        out[k] = walk(v);
      }
    }
    return out;
  }
  try { return walk(input); } catch { return input; }
}
