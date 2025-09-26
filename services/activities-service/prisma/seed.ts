import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function uid(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c=>{ const r=Math.random()*16|0, v=c==='x'?r:(r&0x3|0x8); return v.toString(16); });}
async function run(){
  const routeId = 'route-vondel-loop';
  await prisma.route.upsert({ where:{ id: routeId }, update:{}, create:{ id: routeId, name:'Vondelpark Loop', city:'Amsterdam', difficulty:'easy', polyline:'[[52.357,4.868],[52.359,4.872],[52.361,4.869],[52.359,4.865],[52.357,4.868]]' } });
  console.log('seed: activities ok'); process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
