import { describe, it, expect } from 'vitest';
import * as m from '../packages/data/marketplace/adapter';
describe('marketplace adapter (mock)', ()=>{
  it('lists products and reads one', async ()=>{
    const list = await m.list();
    expect(list.length).toBeGreaterThan(0);
    const p = await m.get(list[0].id);
    expect(p?.id).toBe(list[0].id);
  });
});
