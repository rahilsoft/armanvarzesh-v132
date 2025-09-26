
import { describe, it, expect } from '@jest/globals';

describe('Activity summary math', ()=>{
  it('sums distance and elevation', ()=>{
    const routes = [{distance_m: 1000, elevation_gain_m: 10},{distance_m: 2200, elevation_gain_m: 32}];
    const dist = routes.reduce((a,b)=> a + (b.distance_m||0), 0);
    const elev = routes.reduce((a,b)=> a + (b.elevation_gain_m||0), 0);
    expect(dist).toBe(3200);
    expect(elev).toBe(42);
  });
});
