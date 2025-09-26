import { describe, it, expect } from 'vitest';
import * as api from '../packages/data/notifications/adapter';
describe('notifications adapter (mock)', ()=>{
  it('lists and marks read', async ()=>{
    const list1 = await api.list();
    expect(list1.length).toBeGreaterThan(0);
    const id = list1[0].id;
    await api.markRead(id);
    const list2 = await api.list();
    expect(list2.find(n=> n.id===id)?.read).toBe(true);
  });
});
