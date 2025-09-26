import { describe, it, expect } from 'vitest';
import * as ib from '../packages/data/inbox/adapter';
describe('inbox adapter (mock)', ()=>{
  it('list threads and items, mark read', async ()=>{
    const th = await ib.listThreads();
    expect(th.length).toBeGreaterThan(0);
    const items = await ib.listItems(th[0].id);
    expect(items.length).toBeGreaterThan(0);
    const res = await ib.markRead(items[0].id);
    expect(res.ok).toBe(true);
  });
});
