import { describe, it, expect } from 'vitest';
import * as s from '../packages/data/schedule/adapter';
describe('schedule adapter (mock)', ()=>{
  it('add & set status', async ()=>{
    const added = await s.add(new Date().toISOString(), 'w1', 'p1');
    const upd = await s.setStatus(added.id, 'done');
    expect(upd.status).toBe('done');
  });
});
