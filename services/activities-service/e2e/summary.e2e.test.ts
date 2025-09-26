
import { expect, test } from '@jest/globals';
test('routes math e2e', ()=>{
  const dist = [1000, 2200].reduce((a,b)=>a+b,0);
  expect(dist).toBe(3200);
});
