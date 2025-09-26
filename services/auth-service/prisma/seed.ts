import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

async function main() {
  const prisma = new PrismaClient();
  const email = 'admin@armanfit.local';
  const passwordHash = await argon2.hash('Admin@12345');
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });
  console.log('Auth seed complete');
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });