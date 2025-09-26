
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ScoringService } from '../scoring/scoring.service';
import { Queue } from 'bullmq';
import { PrismaClient } from '@prisma/client';

const log = new Logger('Jobs');
const cron = (fn: ()=>void, ms:number)=> setInterval(fn, ms);

@Injectable()
export class JobsService implements OnModuleInit {
  private prisma = new PrismaClient();
  constructor(private scoring: ScoringService){}
  private scoringQ?: Queue; private surveyQ?: Queue;
  onModuleInit(){
    const REDIS_URL = process.env.REDIS_URL;
    if (!REDIS_URL){
      log.warn('REDIS_URL not set — using in-process timers as fallback.');
      // Recompute scores every 6h
      cron(()=> this.safe('recomputeAll', ()=> this.scoring.recomputeAll()), 1000*60*60*6);
      // Generate BIWEEKLY invites daily
      cron(()=> this.safe('generateSurveyInvites', ()=> this.generateSurveyInvites()), 1000*60*60*24);
    } else {
      // BullMQ mode — schedule repeatable jobs
      const { Queue } = require('bullmq');
      this.scoringQ = new Queue('scoring', { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, defaultJobOptions: { attempts: parseInt(process.env.BULLMQ_DEFAULT_ATTEMPTS||'5'), backoff: { type: 'exponential', delay: parseInt(process.env.BULLMQ_BACKOFF_MS||'5000') }, removeOnComplete: parseInt(process.env.BULLMQ_REMOVE_ON_COMPLETE||'1000'), removeOnFail: parseInt(process.env.BULLMQ_REMOVE_ON_FAIL||'5000') },  connection: { url: REDIS_URL } });
      this.surveyQ  = new Queue('survey', { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, defaultJobOptions: { attempts: parseInt(process.env.BULLMQ_DEFAULT_ATTEMPTS||'5'), backoff: { type: 'exponential', delay: parseInt(process.env.BULLMQ_BACKOFF_MS||'5000') }, removeOnComplete: parseInt(process.env.BULLMQ_REMOVE_ON_COMPLETE||'1000'), removeOnFail: parseInt(process.env.BULLMQ_REMOVE_ON_FAIL||'5000') },  connection: { url: REDIS_URL } });
      this.scoringQ.add('recompute-all', { kind:'ALL' }, { repeat:{ every: 1000*60*60*6 }, removeOnComplete: true });
      this.surveyQ.add('biweekly-invites', {}, { repeat:{ every: 1000*60*60*24 }, removeOnComplete: true });

      log.log('Redis mode planned — hook BullMQ here in next deployment.');
      // For now, still run timers to keep behavior same; in next step we will move to BullMQ processors.
      cron(()=> this.safe('recomputeAll', ()=> this.scoring.recomputeAll()), 1000*60*60*6);
      cron(()=> this.safe('generateSurveyInvites', ()=> this.generateSurveyInvites()), 1000*60*60*24);
    }
  }
  private async safe(name:string, fn:()=>Promise<any>){
    try{ await fn(); log.log(`job:${name} OK`);}catch(e:any){ log.error(`job:${name} FAIL ${e?.message||e}`); }
  }
  // same logic as survey.resolver's generator
  async generateSurveyInvites(){
    const now = new Date();
    const twoWeeks = 1000*60*60*24*14;
    const leads = await this.prisma.lead.findMany({ where:{ status: { in: ['OPEN','CONVERTED'] } } });
    for (const l of leads){
      const hasRecent = await this.prisma.surveyInvite.findFirst({
        where:{ userId: l.userId, specialistId: l.specialistId, templateCode:'BIWEEKLY', dueAt:{ gte: new Date(now.getTime()-twoWeeks) } }
      });
      if (!hasRecent){
        await this.prisma.surveyInvite.create({ data:{ userId: l.userId, specialistId: l.specialistId, templateCode:'BIWEEKLY', dueAt: new Date(now.getTime()+24*60*60*1000) } });
      }
    }
  }
}
