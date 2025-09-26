
import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const prisma = new PrismaClient();

const scoringQueue = new Queue('scoring', { connection });
const surveyQueue  = new Queue('survey',  { connection });
const mediaQueue   = new Queue('media',   { connection });

new Worker('scoring', async (job)=>{
  const kind = job.data?.kind || 'ALL';
  if (kind === 'ALL'){
    const rows = await prisma.specialistScore.findMany({ select:{ specialistId:true, role:true } });
    console.log('scoring: snapshot rows', rows.length);
  }
  return { ok: true };
}, { connection });

new Worker('survey', async (job)=>{
  const now = new Date();
  const twoWeeks = 1000*60*60*24*14;
  const leads = await prisma.lead.findMany({ where:{ status: { in: ['OPEN','CONVERTED'] } } });
  let created = 0;
  for (const l of leads){
    const hasRecent = await prisma.surveyInvite.findFirst({
      where:{ userId: l.userId, specialistId: l.specialistId, templateCode:'BIWEEKLY', dueAt:{ gte: new Date(now.getTime()-twoWeeks) } }
    });
    if (!hasRecent){
      await prisma.surveyInvite.create({ data:{ userId: l.userId, specialistId: l.specialistId, templateCode:'BIWEEKLY', dueAt: new Date(now.getTime()+24*60*60*1000) } });
      created++;
    }
  }
  return { created };
}, { connection });

new Worker('media', async (job)=>{
  const id = job.data?.jobId;
  if (!id) return { skipped: true };
  const m = await prisma.mediaJob.findUnique({ where:{ id } });
  if (!m || m.status !== 'PENDING') return { skipped: true };
  await prisma.mediaJob.update({ where:{ id }, data:{ status:'RUNNING' } });
  const thumb = (m.url||'') + (m.url?.includes('?')? '&':'?') + 'thumb=1';
  await prisma.mediaJob.update({ where:{ id }, data:{ status:'DONE', result: { thumbnail: thumb } } });
  return { ok: true, thumbnail: thumb };
}, { connection });

for (const q of ['scoring','survey','media']){
  const qe = new QueueEvents(q, { connection });
  qe.on('completed', ({ jobId })=> console.log(q, 'completed', jobId));
  qe.on('failed', ({ jobId, failedReason })=> console.error(q, 'failed', jobId, failedReason));
}

console.log('BullMQ worker started');
