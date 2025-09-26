import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

function uid(): string { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8); return v.toString(16);
});}

function clamp(v:number, min:number, max:number){ return Math.max(min, Math.min(max, v)); }
function isFiniteNumber(x:any){ return typeof x==='number' && isFinite(x) && !isNaN(x); }

function seeded(seed:number){ // linear congruential
  let s = seed >>> 0;
  return ()=> (s = (s*1664525 + 1013904223) >>> 0) / 0xFFFFFFFF;
}

function dot(a:number[], b:number[]){ let s=0; for (let i=0;i<Math.min(a.length,b.length);i++) s += a[i]*b[i]; return s; }
function norm(a:number[]){ return Math.sqrt(a.reduce((x,y)=>x+y*y,0)); }
function cosine(a:number[], b:number[]){ const na=norm(a), nb=norm(b); if(na===0||nb===0) return 0; return dot(a,b)/(na*nb); }

@Injectable()
export class AiService {
  prisma = new PrismaClient();
  SNAPSHOT_ID = 'model-v1';

  async ensureModel(){
    const m = await this.prisma.modelSnapshot.findUnique({ where: { id: this.SNAPSHOT_ID } });
    if (!m){
      await this.prisma.modelSnapshot.create({ data: { id: this.SNAPSHOT_ID, name: 'Heuristic v1' } });
    }
  }

  // Heuristic suggestion engine with explanation, deterministic by seed
  async suggestNextSet(input: { userId:string, lastSets:{exerciseId:string, weight:number, reps:number, rpe?:number}[], fatigue?:number, hr?:number, seed?:number }){
    await this.ensureModel();
    const seed = input.seed ?? (input.hr ?? 42);
    const rnd = seeded(Math.floor(Number(seed)||42));

    // aggregate last set (use latest)
    const last = input.lastSets?.[input.lastSets.length-1];
    if (!last) throw new BadRequestException('NO_HISTORY');
    const w = isFiniteNumber(last.weight) ? last.weight : 0;
    const reps = isFiniteNumber(last.reps) ? last.reps : 0;
    const rpe = isFiniteNumber(last.rpe) ? last.rpe! : 7;
    const fatigue = clamp(isFiniteNumber(input.fatigue) ? input.fatigue! : 0.3, 0, 1);
    const hr = clamp(isFiniteNumber(input.hr) ? input.hr! : 120, 40, 210);

    // heuristic: adjust weight ± based on RPE & fatigue
    const rpeDelta = (8 - rpe) * 0.02;     // if RPE low, increase
    const fatigueDelta = -fatigue * 0.05;  // more fatigue → reduce
    const hrDelta = ( (150 - hr) / 150 ) * 0.03; // higher HR → reduce a bit
    const jitter = (rnd()-0.5) * 0.02;     // small randomness
    const mult = 1 + rpeDelta + fatigueDelta + hrDelta + jitter;

    const recWeight = Math.max(0, Number((w * mult).toFixed(1)));
    const recReps   = clamp(Math.round(reps + (rpe<7? +1 : rpe>9? -1 : 0)), 1, 30);
    const confidence = clamp(Math.round((0.7 - fatigue*0.3 + (10-rpe)*0.02) * 100), 0, 100);

    const explanation = [
      `Base on last set (w=${w}, reps=${reps}, RPE=${rpe}).`,
      `Fatigue=${fatigue} adjusted weight ${(fatigueDelta*100).toFixed(1)}%.`,
      `HR=${hr} adjusted ${(hrDelta*100).toFixed(1)}%.`,
      `RPE delta ${(rpeDelta*100).toFixed(1)}%, jitter ${(jitter*100).toFixed(1)}%.`
    ].join(' ');

    const result = { weight: recWeight, reps: recReps, confidence, why: explanation, modelId: this.SNAPSHOT_ID };
    await this.prisma.suggestionLog.create({ data: { id: uid(), userId: input.userId, payload: input as any, result: result as any, explanation, modelId: this.SNAPSHOT_ID } });
    return result;
  }

  // Readiness 0..100 with factors
  async readiness(userId: string, factors?: { hrv?:number, sleepHours?:number, load?:number, soreness?:number }){
    const hrv = clamp(isFiniteNumber(factors?.hrv) ? factors!.hrv : 60, 10, 120);
    const sleep = clamp(isFiniteNumber(factors?.sleepHours) ? factors!.sleepHours : 7, 0, 14);
    const load = clamp(isFiniteNumber(factors?.load) ? factors!.load : 0.5, 0, 3);
    const soreness = clamp(isFiniteNumber(factors?.soreness) ? factors!.soreness : 0.3, 0, 1);
    // simple weighted score
    const score = Math.round(clamp((hrv/1.2 + sleep*5 - load*10 - soreness*15), 0, 100));
    const rec = { score, factors: { hrv, sleepHours: sleep, load, soreness } };
    await this.prisma.readinessRecord.create({ data: { id: uid(), userId, score, factors: rec.factors as any } });
    return rec;
  }

  // Coach-match: cosine similarity between user vector and coach profiles
  private toVec(x:any): number[]{
    if (Array.isArray(x)) return x.map(n=> isFiniteNumber(n)? n : 0);
    if (typeof x === 'object' && x) return Object.values(x).map(v=> isFiniteNumber(v)? v : 0);
    return [];
  }

  async coachMatch(userFeatures: any){
    await this.ensureModel();
    const uvec = this.toVec(userFeatures);
    if (!uvec.length) throw new BadRequestException('BAD_FEATURES');
    const coaches = await this.prisma.coachProfile.findMany();
    const ranked = coaches.map(c=>{
      const cvec = this.toVec(c.vec as any);
      const sim = cosine(uvec, cvec);
      return { coachId: c.coachId, tags: c.tags, score: Number(sim.toFixed(4)) };
    }).sort((a,b)=> b.score - a.score);
    return { modelId: this.SNAPSHOT_ID, matches: ranked };
  }
}
