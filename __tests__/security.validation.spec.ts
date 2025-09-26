import { describe, it, expect } from 'vitest';
import { isSafeText, sanitizeText, safeNumber } from '../packages/security/validation';
describe('validation helpers', ()=>{
  it('rejects script tags', ()=>{
    expect(isSafeText('<script>alert(1)</script>')).toBe(false);
  });
  it('sanitizes angle brackets', ()=>{
    expect(sanitizeText('<b>')).toBe('&lt;b&gt;');
  });
  it('safeNumber bounds', ()=>{
    expect(safeNumber('10', { min:0, max:20 })).toBe(10);
    expect(safeNumber('-5', { min:0 })).toBe(null);
  });
});
