import { Injectable, BadRequestException } from '@nestjs/common';
import { getPrisma } from './prisma';

function uid(): string { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8); return v.toString(16);
});}

function toRad(d:number){ return d * Math.PI / 180; }
function haversine(lat1:number, lon1:number, lat2:number, lon2:number){
  const R = 6371000; // meters
  const dLat = toRad(lat2-lat1), dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}

export type TrackPoint = { lat:number, lng:number, ts:number, elevM?:number, paused?:boolean };

export function smoothTrack(points:TrackPoint[]){
  // Simple drift filter: drop jumps > 50m within 1s; moving avg on elevation
  const out:any[] = [];
  const elevWin:number[] = [];
  // Compare against the last ACCEPTED point, not points[i-1]. Using the raw
  // predecessor meant a rejected drift spike stayed the reference, so the next
  // legitimate reading — measured from the bogus position — was dropped too.
  let last: TrackPoint | undefined;
  for (let i=0;i<points.length;i++){
    const p = points[i];
    if (last){
      const dt = Math.max(1, (p.ts - last.ts)/1000);
      const d = haversine(last.lat, last.lng, p.lat, p.lng);
      const speed = d/dt; // m/s
      if (d>50 && speed>8){ // >50m jump and >28.8km/h -> likely drift
        continue;
      }
    }
    elevWin.push(p.elevM||0);
    if (elevWin.length>5) elevWin.shift();
    const elevAvg = elevWin.reduce((a,b)=>a+b,0)/elevWin.length;
    out.push({ ...p, elevM: elevAvg });
    last = p;
  }
  return out;
}

@Injectable()
export class ActivitiesService {
  prisma = getPrisma();

  async createRoute(userId: string, name: string, polyline: string, difficulty?: string, city?: string){
    if (!name || !polyline) throw new BadRequestException('MISSING_FIELDS');
    return this.prisma.route.create({ data: { id: uid(), name, polyline, difficulty: difficulty||null, city: city||null, createdBy: userId } });
  }

  async startActivity(userId: string, routeId?: string){
    const a = await this.prisma.activity.create({ data: { id: uid(), userId, routeId: routeId||null, status: 'live', startedAt: new Date() } });
    return { id: a.id, startedAt: a.startedAt.toISOString() };
  }

  async tick(activityId: string, point: { ts?: string, lat: number, lng: number, elevM?: number, paused?: boolean }){
    const a = await this.prisma.activity.findUnique({ where: { id: activityId } });
    if (!a || a.status!=='live') throw new BadRequestException('NOT_LIVE');
    const ts = point.ts ? new Date(point.ts) : new Date();
    await this.prisma.activityTick.create({ data: { id: uid(), activityId, ts, lat: point.lat, lng: point.lng, elevM: point.elevM||0, paused: !!point.paused } });
    return { ok: true };
  }

  async endActivity(userId: string, activityId: string){
    const a = await this.prisma.activity.findUnique({ where: { id: activityId }, include: { ticks: true } });
    if (!a || a.userId !== userId) throw new BadRequestException('NOT_FOUND_OR_FORBIDDEN');
    const ticks = a.ticks.sort((x,y)=> x.ts.getTime()-y.ts.getTime());
    const raw = ticks.map(t=> ({ lat: t.lat, lng: t.lng, ts: t.ts.getTime(), elevM: t.elevM||0, paused: t.paused }));
    const points = smoothTrack(raw);

    let dist = 0, elevGain = 0, movingSeconds = 0;
    for (let i=1;i<points.length;i++){
      const p1 = points[i-1], p2 = points[i];
      const d = haversine(p1.lat, p1.lng, p2.lat, p2.lng);
      dist += d;
      const elevDelta = (p2.elevM||0)-(p1.elevM||0);
      if (elevDelta>0) elevGain += elevDelta;
      const dt = Math.max(0, (p2.ts - p1.ts)/1000);
      // Index into the smoothed array, not the raw one: smoothTrack drops
      // points, so raw[i] refers to a different tick than points[i] whenever
      // anything was filtered out — the paused flag came from the wrong tick.
      if (!p2.paused) movingSeconds += dt;
    }
    // An activity with no ticks leaves raw empty, and undefined - undefined is
    // NaN, which propagated into durationS, pace and kcal and was written to
    // the DB. Fall back to a 1s duration.
    const first = raw[0], last = raw.at(-1);
    const spanS = first && last ? Math.round((last.ts - first.ts)/1000) : 0;
    const durationS = Math.max(1, spanS);
    const paceSecPerKm = Math.round((movingSeconds||durationS) / Math.max(0.001, dist/1000));
    // very simple kcal estimation: MET 8 (run) * 3.5 * kg / 200 * minutes  (assume 70kg)
    const minutes = durationS / 60;
    const kcal = Math.round(8 * 3.5 * 70 / 200 * minutes);

    const upd = await this.prisma.activity.update({ where: { id: activityId }, data: {
      status: 'ended', endedAt: new Date(), distanceM: dist, durationS, paceSecPerKm, kcal, elevGainM: elevGain
    }});
    return { id: upd.id, distanceM: Math.round(dist), durationS, paceSecPerKm, kcal, elevGainM: Math.round(elevGain) };
  }

  async inviteFriends(activityId: string, inviterId: string, userIds: string[]){
    const a = await this.prisma.activity.findUnique({ where: { id: activityId } });
    if (!a || a.userId !== inviterId) throw new BadRequestException('NOT_FOUND_OR_FORBIDDEN');
    const out = [];
    for (const u of userIds){
      try {
        const r = await this.prisma.activityInvite.create({ data: { id: uid(), activityId, inviterId, inviteeId: u } });
        out.push({ inviteeId: u, status: 'pending' });
      } catch { out.push({ inviteeId: u, status: 'duplicate' }); }
    }
    return { invites: out };
  }

  async getActivity(activityId: string){
    const a = await this.prisma.activity.findUnique({ where: { id: activityId }, include: { ticks: true, route: true } });
    if (!a) throw new BadRequestException('NOT_FOUND');
    return a;
  }
}
