import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const bcrypt = await import('bcrypt');

  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'seed@example.com' },
    create: { email: 'seed@example.com', name: 'Seed User', password: passwordHash },
    update: {},
  });

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
