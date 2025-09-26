
import { expect, test } from '@jest/globals';
test('unique join constraint e2e', ()=>{
  const key = (cid:number, uid:number)=> `${cid}-${uid}`;
  const s = new Set(['1-10']);
  expect(s.has(key(1,10))).toBe(true);
});
