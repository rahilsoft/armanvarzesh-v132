import { describe, it, expect } from 'vitest';
import * as r from '../packages/data/reviews/adapter';
describe('reviews adapter (mock)', ()=>{
  it('add pending review', async ()=>{
    const before = await r.list('c1');
    const added = await r.add('c1', 5, 'great');
    expect(added.status).toBe('pending');
    const after = await r.list('c1'); // still only published
    expect(after.length).toBe(before.length);
  });
});
