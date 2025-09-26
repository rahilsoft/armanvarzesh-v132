import { describe, it, expect } from 'vitest';
import { maskEmail, maskPhone, scrubPII } from '../packages/security/sanitize';
describe('sanitize', ()=>{
  it('masks email', ()=>{ expect(maskEmail('user@example.com')).toMatch(/\*+@example\.com$/); });
  it('masks phone', ()=>{ expect(maskPhone('+989121234567')).toMatch(/\*{7}\d{4}$/); });
  it('scrubs deep objects', ()=>{
    const out = scrubPII({ a:{ email:'a@b.com' }, b:{ phone:'+989121234567' } });
    expect(JSON.stringify(out)).not.toContain('a@b.com');
  });
});
