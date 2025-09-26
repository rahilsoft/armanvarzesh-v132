import { haversine, smooth, stats } from '../src/geo';

describe('geo math', ()=>{
  it('haversine ~ known short distance', ()=>{
    const d = haversine({lat:52.357, lng:4.868},{lat:52.3575, lng:4.870});
    expect(d).toBeGreaterThan(100);
    expect(d).toBeLessThan(300);
  });
  it('smooth removes spikes', ()=>{
    const pts = [
      {lat:0,lng:0, ts:0}, {lat:0.001,lng:0.001, ts:1000},
      {lat:1, lng:1, ts:2000}, // insane spike
      {lat:0.0011,lng:0.0011, ts:3000}
    ];
    const s = smooth(pts, 200);
    expect(s.length).toBe(3);
  });
  it('stats basic', ()=>{
    const t0 = Date.now();
    const pts = [
      {lat:0,lng:0, ts:t0}, {lat:0.001,lng:0.001, ts:t0+60_000}
    ];
    const s = stats(pts as any, 70);
    expect(s.distanceM).toBeGreaterThan(100);
    expect(s.durationS).toBe(60);
    expect(s.kcal).toBeGreaterThan(0);
  });
});
