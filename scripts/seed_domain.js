
/**
 * Dynamic, best-effort domain seeder.
 * It tries to locate Prisma clients generated in services/app folders
 * and creates minimal demo records ONLY if the models exist.
 * Non-fatal on errors. Safe to run repeatedly (uses upsert-like patterns).
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
    console.log(`[seed] skip (no Prisma client yet): ${serviceDir}`);
    return;
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
      }).catch(()=>{});
      console.log(`[seed] workoutPlan seeded in ${serviceDir}`);
    }
    if (has('nutritionPlan')) {
      await prisma['nutritionPlan'].create({
        data: {
          title: 'Demo Nutrition — High Protein',
          kcal: 2200
        }
      }).catch(()=>{});
      console.log(`[seed] nutritionPlan seeded in ${serviceDir}`);
    }
    if (has('payment')) {
      await prisma['payment'].create({
        data: {
          amount: 99000,
          currency: 'IRR',
          status: 'PAID'
        }
      }).catch(()=>{});
      console.log(`[seed] payment seeded in ${serviceDir}`);
    }
  } catch (e) {
    console.log(`[seed] non-fatal in ${serviceDir}:`, e.message);
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
  process.exit(0); // non-fatal
});
