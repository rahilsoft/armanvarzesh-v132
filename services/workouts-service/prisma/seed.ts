import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const data = [
  { name: 'Push Up', level: 'beginner', muscle: 'chest', equipment: 'bodyweight' },
  { name: 'Pull Up', level: 'intermediate', muscle: 'back', equipment: 'bodyweight' },
  { name: 'Squat', level: 'beginner', muscle: 'legs', equipment: 'bodyweight' },
  { name: 'Deadlift', level: 'advanced', muscle: 'back', equipment: 'barbell' },
  { name: 'Shoulder Press', level: 'intermediate', muscle: 'shoulders', equipment: 'dumbbell' },
  { name: 'Bicep Curl', level: 'beginner', muscle: 'arms', equipment: 'dumbbell' },
  { name: 'Tricep Dip', level: 'intermediate', muscle: 'arms', equipment: 'bodyweight' },
];
async function run(){
  for (const e of data) await prisma.exercise.upsert({ where: { name: e.name }, update: {}, create: e });
  console.log('Seeded exercises');
  await prisma.$disconnect();
}
run();