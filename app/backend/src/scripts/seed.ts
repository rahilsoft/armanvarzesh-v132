/* Seed script: will try Prisma if available; otherwise logs and exits. */
async function main() {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.user.upsert({ where: { id: 'u1' }, update: {}, create: { id: 'u1', email: 'u1@example.com' } });
    await prisma.$disconnect();
    console.log('Seed completed');
  } catch (e) {
    console.log('Prisma not available; seed skipped.');
  }
}
main();
