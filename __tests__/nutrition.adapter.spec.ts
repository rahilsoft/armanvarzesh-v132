import { describe, it, expect } from 'vitest';
import * as n from '../packages/data/nutrition/adapter';
describe('nutrition adapter (mock)', ()=>{
  it('lists meals & gets one', async ()=>{
    const meals = await n.listMeals();
    expect(meals.length).toBeGreaterThan(0);
    const m = await n.getMeal(meals[0].id);
    expect(m?.id).toBe(meals[0].id);
  });
});
