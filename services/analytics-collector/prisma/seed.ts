import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function uid(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c=>{ const r=Math.random()*16|0, v=c==='x'?r:(r&0x3|0x8); return v.toString(16); });}

async function run(){
  const base = new Date(); base.setUTCHours(0,0,0,0);
  const users = ['u1','u2','u3'];
  const names = ['SIGNUP','SESSION_COMPLETED','SUBSCRIPTION_PURCHASED'];
  let i = 0;
  for (const u of users){
    for (const n of names){
      await prisma.event.create({ data: { id: uid(), userId: u, name: n, ts: new Date(base.getTime() + i*60*60*1000), idemKey: `seed-${u}-${n}` } });
      i++;
    }
  }
  console.log('seed: analytics ok'); process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
