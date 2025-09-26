import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function uid(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c=>{ const r=Math.random()*16|0, v=c==='x'?r:(r&0x3|0x8); return v.toString(16); });}

async function run(){
  await prisma.modelSnapshot.upsert({ where:{ id:'model-v1' }, update:{}, create:{ id:'model-v1', name:'Heuristic v1' } });
  const coaches = [
    { coachId:'c-strength', tags:['strength','powerlifting'], vec:[0.9,0.1,0.2,0.8,0.1] },
    { coachId:'c-endurance', tags:['endurance','running'], vec:[0.1,0.9,0.8,0.1,0.2] },
    { coachId:'c-balance', tags:['mobility','balance'], vec:[0.4,0.4,0.4,0.4,0.9] },
  ];
  for (const c of coaches){
    await prisma.coachProfile.upsert({ where:{ coachId: c.coachId }, update:{ vec:c.vec as any, tags:c.tags }, create:{ id: uid(), coachId: c.coachId, tags: c.tags as any, vec: c.vec as any } });
  }
  console.log('seed: ai ok'); process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
