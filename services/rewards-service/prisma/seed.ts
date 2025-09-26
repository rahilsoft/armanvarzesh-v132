import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function uid(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c=>{ const r=Math.random()*16|0, v=c==='x'?r:(r&0x3|0x8); return v.toString(16); });}
async function run(){
  const tiers = [
    { id:'vip-bronze', name:'Bronze', threshold:500 },
    { id:'vip-silver', name:'Silver', threshold:1500 },
    { id:'vip-gold', name:'Gold', threshold:3000 }
  ];
  for (const t of tiers){
    await prisma.vipTier.upsert({ where:{ name:t.name }, update:{ threshold:t.threshold }, create:{ id:t.id, name:t.name, threshold:t.threshold } });
  }
  await prisma.badge.upsert({ where:{ key:'streak-7' }, update:{}, create:{ id:'badge-streak-7', key:'streak-7', name:'7-day Streak' } });
  console.log('seed: rewards ok'); process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
