
import { describe, it, expect } from '@jest/globals';

describe('Challenges join', ()=>{
  it('unique join constraint conceptual', ()=>{
    // Simulate uniqueness
    const existing = new Set(['1-10']);
    const key = (cid:number, uid:number)=> `${cid}-${uid}`;
    expect(existing.has(key(1,10))).toBe(true);
    expect(existing.has(key(1,99))).toBe(false);
  });
});
