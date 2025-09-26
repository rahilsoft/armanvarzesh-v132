import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

async function main() {
  const prisma = new PrismaClient();
  const csv = fs.readFileSync(path.join(__dirname,'food_items.csv'),'utf-8').trim().split(/\r?\n/).slice(1);
  for (const line of csv) {
    const [name,calories,protein,carbs,fat] = line.split(',');
    await prisma.foodItem.upsert({
      where: { name },
      update: { calories: Number(calories), protein: Number(protein), carbs: Number(carbs), fat: Number(fat) },
      create: { name, calories: Number(calories), protein: Number(protein), carbs: Number(carbs), fat: Number(fat) }
    });
  }
  await prisma.$disconnect();
}

main().catch(e=>{ console.error(e); process.exit(1); });
