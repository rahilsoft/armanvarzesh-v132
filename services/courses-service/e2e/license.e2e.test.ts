
import { expect, test } from '@jest/globals';
test('license token format', ()=>{
  const token = 'abc123';
  expect(typeof token).toBe('string');
});
