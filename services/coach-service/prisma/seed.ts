import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function uid(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c=>{ const r=Math.random()*16|0, v=c==='x'?r:(r&0x3|0x8); return v.toString(16); });}
async function run(){
  const t = await prisma.programTemplate.create({ data: { id:'tpl-strength-1', coachId:'coach-1', name:'Strength 4x', status:'draft', currentVersionNumber:0 } });
  await prisma.programTemplateVersion.create({ data: { id: uid(), templateId: t.id, versionNumber: 0, content: { weeks:4, days:[ 'A','B','Rest','A','B','Rest','Rest' ] } } });
  console.log('seed: coach-service ok'); process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
