import { describe, it, expect } from 'vitest';
import * as p from '../packages/data/physio/adapter';
describe('physio (mock)', ()=>{
  it('assign protocol creates plan', async ()=>{
    const list = await p.listProtocols();
    const created = await p.assign(list[0].id, 'note');
    const plans = await p.listPlans();
    expect(plans.find(pl=> pl.id===created.id)).toBeTruthy();
  });
});
