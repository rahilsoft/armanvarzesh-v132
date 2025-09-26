export type Pt = { lat:number, lng:number, ele?:number, ts?:number, paused?:boolean };

export function haversine(a:Pt, b:Pt): number {
  const R = 6371000;
  const toRad = (x:number)=> x*Math.PI/180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}

export function smooth(points: Pt[], maxDrift=25): Pt[] {
  if (points.length<=2) return points;
  const out:Pt[] = [points[0]];
  for (let i=1;i<points.length-1;i++){
    const prev = out[out.length-1];
    const cur = points[i];
    const next = points[i+1];
    const dPrev = haversine(prev, cur);
    const dNext = haversine(cur, next);
    if (dPrev>maxDrift && dNext>maxDrift){
      // spike: drop it
      continue;
    }
    out.push(cur);
  }
  out.push(points[points.length-1]);
  return out;
}

export function stats(points: Pt[], userKg=75): {distanceM:number, durationS:number, elevationGainM:number, kcal:number, paceSecPerKm:number} {
  if (!points.length) return { distanceM:0, durationS:0, elevationGainM:0, kcal:0, paceSecPerKm:0 };
  const pts = smooth(points);
  let dist = 0, elevGain = 0;
  for (let i=1;i<pts.length;i++){
    dist += haversine(pts[i-1], pts[i]);
    const de = (pts[i].ele??0) - (pts[i-1].ele??0);
    if (de>0) elevGain += de;
  }
  const t0 = pts[0].ts??0, t1 = pts[pts.length-1].ts??t0;
  const dur = Math.max(0, Math.round((t1 - t0)/1000));
  // naive MET by pace ~ running: 8 km/h (~7.5 MET). scale by speed
  const speedMs = dist / Math.max(1, dur);
  const met = Math.max(2, Math.min(15, 3 + speedMs*6)); // clamp 2..15
  const kcal = Math.round(met * userKg * (dur/3600));
  const pace = dist>0 ? Math.round(1000 / speedMs) : 0;
  return { distanceM: Math.round(dist), durationS: dur, elevationGainM: Math.round(elevGain), kcal, paceSecPerKm: pace };
}
