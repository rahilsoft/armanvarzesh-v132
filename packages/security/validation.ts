/**
 * Lightweight validation/sanitization (no external deps)
 */
export function isSafeText(input: string, { max=500 } = {}): boolean{
  if(typeof input !== 'string') return false;
  if(input.length===0 || input.length>max) return false;
  // rudimentary XSS guard
  const lowered = input.toLowerCase();
  if(lowered.includes('<script') || lowered.includes('javascript:') || lowered.includes('onerror=')) return false;
  return true;
}
export function sanitizeText(input: string): string{
  return String(input).replace(/[<>]/g, s=> s==='<'?'&lt;':'&gt;');
}
export function safeNumber(n: any, { min=-Infinity, max=Infinity } = {}): number | null{
  const v = Number(n);
  if(Number.isNaN(v) || !Number.isFinite(v)) return null;
  if(v<min || v>max) return null;
  return v;
}
