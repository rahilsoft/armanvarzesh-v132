import { describe, it, expect } from 'vitest';
import * as mp from '../packages/data/mealplans/adapter';
describe('mealplans adapter (mock)', ()=>{
  it('lists meal plans', async ()=>{
    const list = await mp.list();
    expect(list.length).toBeGreaterThan(0);
  });
});
