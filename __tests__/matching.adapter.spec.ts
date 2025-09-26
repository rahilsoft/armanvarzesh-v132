import { describe, it, expect } from 'vitest';
import { match } from '../packages/data/matching/adapter';
describe('matching (simple scorer)', ()=>{
  it('returns scored list', async ()=>{
    const res = await match({ goal:'weight-loss', genderPref:'any', priceMax:200000 });
    expect(res.length).toBeGreaterThan(0);
    expect(res[0]).toHaveProperty('coachId');
    expect(res[0].score).toBeGreaterThanOrEqual(res[res.length-1].score);
  });
});
