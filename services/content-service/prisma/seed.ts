// Placeholder seed; adjust to your service schema.
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Example: create base roles if table exists
  try {
    // await prisma.role.createMany({ data: [{ name: 'user' }, { name: 'coach' }, { name: 'admin' }] });
  } catch (e) {
    console.log('Seed skipped or schema differs:', e?.message);
  }
}

main().finally(() => prisma.$disconnect());
