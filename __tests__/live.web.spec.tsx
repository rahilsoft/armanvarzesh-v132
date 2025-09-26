import { describe, it, expect } from 'vitest';
import * as api from '../packages/data/live/adapter';
describe('live adapter (mock)', ()=>{
  it('creates a room', async ()=>{
    const before = await api.list();
    const r = await api.create('Test', new Date().toISOString());
    const after = await api.list();
    expect(after.length).toBe(before.length+1);
    expect(after[0].id).toBe(r.id);
  });
});
