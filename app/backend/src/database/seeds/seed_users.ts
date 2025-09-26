import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { email: 'admin@armanvarzesh.com', name: 'Admin', password: 'hashed-password', role: 'admin' },
      { email: 'coach1@armanvarzesh.com', name: 'Coach One', password: 'hashed-password', role: 'coach' },
      { email: 'user1@armanvarzesh.com',  name: 'User One',  password: 'hashed-password', role: 'user'  }
    ],
    skipDuplicates: true
  });
}

main().finally(() => prisma.$disconnect());
