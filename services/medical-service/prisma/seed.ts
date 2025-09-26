import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function uid(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c=>{ const r=Math.random()*16|0, v=c==='x'?r:(r&0x3|0x8); return v.toString(16); });}

async function run(){
  const fId = 'fac-amsterdam-1';
  const dId = 'doc-van-rijn';
  const tA = 'test-fasting-glucose';
  const tB = 'test-vitamin-d';

  const fac = await prisma.facility.upsert({ where:{ id:fId }, update:{}, create:{ id:fId, name:'Arman Clinic Amsterdam', city:'Amsterdam', geoLat:52.37, geoLng:4.90 } });
  const doc = await prisma.doctor.upsert({ where:{ id:dId }, update:{}, create:{ id:dId, name:'Dr. Van Rijn', specialty:'Internal Medicine', facilityId: fac.id } });
  await prisma.healthTest.upsert({ where:{ id:tA }, update:{}, create:{ id:tA, code:'GLU-FAST', name:'Fasting Blood Glucose', requiresFasting:true, facilityId: fac.id } });
  await prisma.healthTest.upsert({ where:{ id:tB }, update:{}, create:{ id:tB, code:'VITD', name:'Vitamin D (25-OH)', requiresFasting:false, facilityId: fac.id } });

  // slots today and tomorrow
  const now = new Date(); now.setMinutes(0,0,0);
  const start1 = new Date(now.getTime() + 3*60*60*1000);
  const end1   = new Date(start1.getTime() + 30*60*1000);
  const start2 = new Date(now.getTime() + 27*60*60*1000);
  const end2   = new Date(start2.getTime() + 30*60*1000);
  await prisma.slot.upsert({ where:{ id:'slot-1' }, update:{}, create:{ id:'slot-1', doctorId: doc.id, startUTC:start1, endUTC:end1, capacity:2 } });
  await prisma.slot.upsert({ where:{ id:'slot-2' }, update:{}, create:{ id:'slot-2', doctorId: doc.id, startUTC:start2, endUTC:end2, capacity:1 } });

  console.log('seed: medical ok');
  process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
