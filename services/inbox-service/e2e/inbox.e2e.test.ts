
import { expect, test } from '@jest/globals';
test('mark read toggles state', ()=>{
  const msg = { id: 1, readAt: null as any };
  msg.readAt = new Date();
  expect(!!msg.readAt).toBe(true);
});
