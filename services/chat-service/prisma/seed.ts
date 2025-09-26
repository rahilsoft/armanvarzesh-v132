import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function uid(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c=>{ const r=Math.random()*16|0, v=c==='x'?r:(r&0x3|0x8); return v.toString(16); });}

async function run(){
  const t = await prisma.thread.upsert({ where:{ id:'thread-u1-coach' }, update:{}, create:{ id:'thread-u1-coach', userId:'u1', coachId:'coach-1' } });
  await prisma.participant.upsert({ where:{ threadId_userId: { threadId: t.id, userId: 'u1' } }, update:{}, create:{ id: uid(), threadId: t.id, userId: 'u1', role: 'user' } });
  await prisma.participant.upsert({ where:{ threadId_userId: { threadId: t.id, userId: 'coach-1' } }, update:{}, create:{ id: uid(), threadId: t.id, userId: 'coach-1', role: 'coach' } });
  console.log('seed: chat ok'); process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
