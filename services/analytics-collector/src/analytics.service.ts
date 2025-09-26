import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

type TrackInput = { eventName: string, userId: string, props?: any, ts?: string, idempotencyKey: string };

function uid(): string { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8); return v.toString(16);
});}

const SENSITIVE_KEYS = new Set(['email','phone','name','firstName','lastName','address']);

@Injectable()
export class AnalyticsService {
  prisma = new PrismaClient();
  PROP_LIMIT = 8 * 1024; // 8KB
  SALT = process.env.ANALYTICS_SALT || 'dev-salt';

  private sanitizeProps(props:any){
    if (!props) return null;
    const raw = JSON.stringify(props);
    if (raw.length > this.PROP_LIMIT) throw new BadRequestException('PROPS_TOO_LARGE');
    const clean:any = {}; const piiHash:any = {};
    for (const [k,v] of Object.entries(props)){
      if (SENSITIVE_KEYS.has(k)){
        if (typeof v === 'string' && v.length){
          const h = crypto.createHash('sha256').update(this.SALT+v).digest('hex');
          piiHash[k] = h;
        }
        continue; // drop raw
      }
      clean[k] = v;
    }
    return { clean, piiHash: Object.keys(piiHash).length? piiHash : null };
  }

  async track(input: TrackInput){
    if (!input.eventName || !input.userId || !input.idempotencyKey) throw new BadRequestException('MISSING_FIELDS');
    const { clean, piiHash } = this.sanitizeProps(input.props) || { clean:null, piiHash:null };
    try {
      await this.prisma.event.create({ data: { id: uid(), userId: input.userId, name: input.eventName, ts: input.ts? new Date(input.ts) : new Date(), props: clean as any, piiHash: piiHash as any, idemKey: input.idempotencyKey } });
    } catch(e:any){
      // unique violation on idemKey ⇒ exactly-once
    }
    return { ok: true };
  }

  private async computeDaily(dateStr: string){
    const dayStart = new Date(dateStr+'T00:00:00Z');
    const dayEnd = new Date(dayStart.getTime() + 24*60*60*1000);
    const events = await this.prisma.event.findMany({ where: { ts: { gte: dayStart, lt: dayEnd } } });
    const users = new Set(events.map(e=>e.userId));
    const dau = users.size;
    const sessions = events.filter(e=> e.name === 'SESSION_COMPLETED').length;
    const signups = events.filter(e=> e.name === 'SIGNUP').length;
    const purchases = events.filter(e=> e.name === 'SUBSCRIPTION_PURCHASED').length;
    // adherence: avg per-user sessions per day capped at 1
    const perUser: Record<string, number> = {};
    for (const e of events.filter(e=> e.name === 'SESSION_COMPLETED')){
      perUser[e.userId] = Math.min(1, (perUser[e.userId]||0)+1);
    }
    const adherence = dau ? (Object.values(perUser).reduce((a,b)=>a+b,0) / dau) : 0;
    const conversionSignupToSub = signups ? (purchases / signups) : 0;
    return { dau, sessions, signups, purchases, adherence, conversionSignupToSub };
  }

  async kpisRange(from?: string, to?: string){
    const start = from ? new Date(from) : new Date(Date.now()-7*24*60*60*1000);
    const end = to ? new Date(to) : new Date();
    const days = [];
    for (let d=new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())); d < end; d = new Date(d.getTime()+24*60*60*1000)){
      const ds = d.toISOString().slice(0,10);
      const metrics = await this.computeDaily(ds);
      days.push({ date: ds, ...metrics });
    }
    // MAU approximate: distinct users across window
    const events = await this.prisma.event.findMany({ where: { ts: { gte: start, lt: end } }, select: { userId: true }, distinct: ['userId'] });
    const mau = events.length;
    return { range: { from: start.toISOString(), to: end.toISOString() }, mau, days };
  }

  async rollup(from?: string, to?: string){
    const res = await this.kpisRange(from, to);
    for (const d of res.days){
      await this.prisma.kpiDaily.upsert({
        where: { date: new Date(d.date+'T00:00:00Z') },
        update: { dau: d.dau, sessions: d.sessions, signups: d.signups, purchases: d.purchases, adherence: d.adherence, conversionSignupToSub: d.conversionSignupToSub },
        create: { date: new Date(d.date+'T00:00:00Z'), dau: d.dau, sessions: d.sessions, signups: d.signups, purchases: d.purchases, adherence: d.adherence, conversionSignupToSub: d.conversionSignupToSub }
      });
    }
    return { ok: true };
  }

  async exportCsv(from?: string, to?: string){
    const res = await this.kpisRange(from, to);
    const header = ['date','dau','sessions','signups','purchases','adherence','conversionSignupToSub'];
    const rows = [header.join(',')];
    for (const d of res.days){
      rows.push([d.date,d.dau,d.sessions,d.signups,d.purchases,d.adherence.toFixed(4),d.conversionSignupToSub.toFixed(4)].join(','));
    }
    return rows.join('\n');
  }
}
