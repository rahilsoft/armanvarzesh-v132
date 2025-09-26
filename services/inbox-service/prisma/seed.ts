
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main(){
  await prisma.notificationInbox.createMany({ data: [
    { userId:1, type:'welcome', payload:{ msg:'Welcome to ArmanVarzesh' } },
    { userId:1, type:'course_certificate', payload:{ courseId:1, certCode:'CERT-001' }, deeplink:'av://cert/1' }
  ], skipDuplicates: true });
  console.log('Seeded inbox');
}
main().finally(()=>prisma.$disconnect());
