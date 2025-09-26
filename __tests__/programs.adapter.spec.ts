import { describe, it, expect } from 'vitest';
import * as p from '../packages/data/programs/adapter';
describe('programs adapter (mock)', ()=>{
  it('list & create', async ()=>{
    const before = await p.list();
    await p.create({ id:'px', title:'t', weeks:1, level:'beginner', plan:[] } as any);
    const after = await p.list();
    expect(after.length).toBe(before.length+1);
  });
});
