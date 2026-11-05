
/**
 * Dynamic, best-effort domain seeder.
 * It tries to locate Prisma clients generated in services/app folders
 * and creates minimal demo records ONLY if the models exist.
 * Fail closed (REV-20261024-02): any seeding error exits non-zero so CI turns red.
 * Safe to run repeatedly (uses upsert-like patterns).
 */
const fs = require('fs');
const path = require('path');

async function trySeedService(serviceDir) {
  const prismaClientPath = path.join(serviceDir, 'node_modules', '@prisma', 'client');
  if (!fs.existsSync(prismaClientPath)) return;

  let PrismaClient;
  try {
    ({ PrismaClient } = require(prismaClientPath));
  } catch (e) {
    console.error(`[seed] Prisma client present but not loadable in ${serviceDir}:`, e.message);
    throw e;
  }

  const prisma = new PrismaClient();
  const candidates = [
    'user','client','coach','workoutPlan','workout','exercise','nutritionPlan','meal','payment','transaction'
  ];

  try {
    // helper: check accessor presence
    const has = (name) => prisma && typeof prisma[name] === 'object' && typeof prisma[name].upsert === 'function' || typeof prisma[name]?.create === 'function';

    // minimal seeds
    if (has('user')) {
      await prisma['user'].upsert({
        where: { email: 'demo.user@armanfit.test' },
        update: {},
        create: { email: 'demo.user@armanfit.test', name: 'Demo User' }
      });
      console.log(`[seed] user seeded in ${serviceDir}`);
    }
    if (has('coach')) {
      await prisma['coach'].upsert({
        where: { handle: 'demo-coach' },
        update: {},
        create: { handle: 'demo-coach', displayName: 'Demo Coach' }
      });
      console.log(`[seed] coach seeded in ${serviceDir}`);
    }
    if (has('workoutPlan')) {
      await prisma['workoutPlan'].create({
        data: {
          title: 'Demo Plan — 4 Weeks',
          weeks: 4
        }
      });
      console.log(`[seed] workoutPlan seeded in ${serviceDir}`);
    }
    if (has('nutritionPlan')) {
      await prisma['nutritionPlan'].create({
        data: {
          title: 'Demo Nutrition — High Protein',
          kcal: 2200
        }
      });
      console.log(`[seed] nutritionPlan seeded in ${serviceDir}`);
    }
    if (has('payment')) {
      await prisma['payment'].create({
        data: {
          amount: 99000,
          currency: 'IRR',
          status: 'PAID'
        }
      });
      console.log(`[seed] payment seeded in ${serviceDir}`);
    }
  } catch (e) {
    console.error(`[seed] failed in ${serviceDir}:`, e.message);
    throw e;
  } finally {
    try { await prisma.$disconnect(); } catch {}
  }
}

async function main() {
  const root = path.resolve(__dirname, '..');
  const targets = [];
  for (const base of ['services','app','packages']) {
    const baseDir = path.join(root, base);
    if (!fs.existsSync(baseDir)) continue;
    for (const name of fs.readdirSync(baseDir)) {
      const p = path.join(baseDir, name);
      if (fs.statSync(p).isDirectory()) targets.push(p);
    }
  }
  for (const dir of targets) {
    await trySeedService(dir);
  }
  console.log('[seed] domain seeding done.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
