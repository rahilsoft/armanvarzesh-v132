
import { PrismaClient, Difficulty } from '@prisma/client';
const prisma = new PrismaClient();
async function main(){
  const c = await prisma.course.upsert({
    where:{ id:1 }, update:{},
    create:{ id:1, title:'Strength 101', summary:'Basics', difficulty: 'beginner' as Difficulty }
  });
  await prisma.courseAsset.createMany({ data: [
    { courseId: c.id, idx: 1, encUrl: 's3://enc/ch1', durationS: 300 },
    { courseId: c.id, idx: 2, encUrl: 's3://enc/ch2', durationS: 420 },
  ], skipDuplicates: true });
  await prisma.certificate.upsert({
    where:{ code:'CERT-001' },
    update:{},
    create:{ code:'CERT-001', qrToken:'QR-TOKEN-1', courseId:c.id, userId:1 }
  });
  console.log('Seeded courses');
}
main().finally(()=>prisma.$disconnect());
