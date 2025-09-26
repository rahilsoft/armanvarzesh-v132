import { describe, it, expect } from 'vitest';
import * as c from '../packages/data/cart/adapter';
describe('cart adapter (mock)', ()=>{
  it('add items and set qty', async ()=>{
    const start = await c.get();
    expect(start.items.length).toBeGreaterThanOrEqual(0);
    await c.add({ productId:'p1', qty:1, price:100, title:'x', currency:'IRT' } as any);
    const after = await c.get();
    expect(after.items.length).toBeGreaterThan(0);
    await c.setQty('p1', 2);
    const after2 = await c.get();
    expect(after2.items.find(i=> i.productId==='p1')?.qty).toBe(2);
  });
});
