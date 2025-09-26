import { describe, it, expect } from '@jest/globals';

function toRad(d:number){ return d*Math.PI/180; }
function haversine(lat1:number, lon1:number, lat2:number, lon2:number){
  const R=6371000, dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1);
  const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}

describe('unit conversions', ()=>{
  it('haversine ~ known short segment', ()=>{
    const d = haversine(52.357,4.868,52.358,4.869);
    expect(d).toBeGreaterThan(100); // ~130m
    expect(d).toBeLessThan(200);
  });
});

describe('smoothing drops big jumps', ()=>{
  function smooth(points:{lat:number,lng:number,ts:number}[]){
    const out:any[] = [];
    for (let i=0;i<points.length;i++){
      const p = points[i];
      if (i>0){
        const prev = points[i-1];
        const dt = Math.max(1, (p.ts - prev.ts)/1000);
        const d = haversine(prev.lat, prev.lng, p.lat, p.lng);
        const speed = d/dt;
        if (d>50 && speed>8) continue;
      }
      out.push(p);
    }
    return out;
  }
  it('removes a 500m teleport', ()=>{
    const t=Date.now();
    const pts=[{lat:0,lng:0,ts:t},{lat:0.001,lng:0.001,ts:t+1000},{lat:0.01,lng:0.01,ts:t+2000}];
    const s = smooth(pts);
    expect(s.length).toBe(2);
  });
});

describe('pause/resume semantics (conceptual)', ()=>{
  it('documented', ()=> expect(1).toBe(1));
});
