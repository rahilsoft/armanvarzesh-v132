import { describe, it, expect } from 'vitest';
import { sanitizeText, isSafeText } from '../packages/security/validation';
describe('a11y/security utils', ()=>{
  it('sanitize keeps text readable', ()=>{
    expect(sanitizeText('<h1>سلام</h1>').includes('&lt;')).toBe(true);
  });
  it('isSafeText blocks dangerous js urls', ()=>{
    expect(isSafeText('javascript:alert(1)')).toBe(false);
  });
});
