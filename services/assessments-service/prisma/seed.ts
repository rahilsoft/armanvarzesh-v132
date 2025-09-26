import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function uid(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c=>{ const r=Math.random()*16|0, v=c==='x'?r:(r&0x3|0x8); return v.toString(16); });}

async function run(){
  const assessId = 'assess-mobility-basic';
  const exists = await prisma.assessment.findUnique({ where: { id: assessId } });
  if (exists) { console.log('seed: exists'); process.exit(0); }

  await prisma.assessment.create({
    data: {
      id: assessId, code: 'MOB-BASIC', name: 'Mobility Baseline', domain: 'mobility', durationMin: 8,
      sections: { create: [
        { id: uid(), title: 'Ankles & Hips', order: 1, questions: { create: [
          { id: 'q-ankle-dorsi', type: 'number', text: 'Ankle dorsiflexion (deg)', scoring: { range:{ min:0, max:40, mult:2 }, weight: 1 } },
          { id: 'q-hip-flex', type: 'number', text: 'Hip flexion (deg)', scoring: { range:{ min:0, max:130, mult:1 }, weight: 1 } },
          { id: 'q-pain', type: 'single', text: 'Pain present during movement?', options: ['yes','no'], scoring: { map: { yes: -10, no: 0 }, weight: 1 } }
        ] } },
      ] }
    }
  });

  console.log('seed: done');
  process.exit(0);
}

run().catch(e=>{ console.error(e); process.exit(1); });
