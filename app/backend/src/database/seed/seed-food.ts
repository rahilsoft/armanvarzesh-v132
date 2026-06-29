import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

async function main() {
  const prisma = new PrismaClient();
  const csv = fs.readFileSync(path.join(__dirname,'food_items.csv'),'utf-8').trim().split(/\r?\n/).slice(1);
  for (const line of csv) {
    const [title,calories,protein,carbs,fat] = line.split(',');
    const existing = await prisma.food.findFirst({ where: { title } });
    const values = { calories: Number(calories), protein: Number(protein), carbs: Number(carbs), fat: Number(fat) };
    if (existing) {
      await prisma.food.update({ where: { id: existing.id }, data: values });
    } else {
      await prisma.food.create({ data: { title, ...values } });
    }
  }
  await prisma.$disconnect();
}

main().catch(e=>{ console.error(e); process.exit(1); });
