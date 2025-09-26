import { describe, it, expect } from 'vitest';
import * as api from '../packages/data/coaches/adapter';
describe('coaches adapter (mock)', ()=>{
  it('list filter by price & rating', async ()=>{
    const all = await api.list({});
    const filtered = await api.list({ priceMax: 140000, ratingMin: 4.6 });
    expect(filtered.every(c=> c.price <= 140000 && c.rating >= 4.6)).toBe(true);
    expect(all.length).toBeGreaterThanOrEqual(filtered.length);
  });
});
