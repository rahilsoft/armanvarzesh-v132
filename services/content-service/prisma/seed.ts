/**
 * Seed script for content-service
 * Creates initial data for testing and development
 */
import { PrismaClient, ServiceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding content-service database...');

  try {
    // Seed ServiceType weights for scoring
    const scoringWeights = [
      {
        role: ServiceType.COACH,
        weights: {
          followup: 0.2,
          multimodal: 0.15,
          biweekly: 0.1,
          endterm: 0.15,
          renewal: 0.15,
          goalFocus: 0.1,
          freeToPremium: 0.1,
          contentQuality: 0.05,
        },
      },
      {
        role: ServiceType.NUTRITIONIST,
        weights: {
          followup: 0.25,
          multimodal: 0.1,
          biweekly: 0.1,
          endterm: 0.15,
          renewal: 0.2,
          goalFocus: 0.1,
          freeToPremium: 0.1,
        },
      },
      {
        role: ServiceType.PHYSICAL_THERAPIST,
        weights: {
          followup: 0.2,
          multimodal: 0.15,
          biweekly: 0.1,
          endterm: 0.2,
          renewal: 0.15,
          goalFocus: 0.1,
          freeToPremium: 0.1,
        },
      },
    ];

    for (const weight of scoringWeights) {
      await prisma.scoringWeights.upsert({
        where: { role: weight.role },
        update: { weights: weight.weights },
        create: {
          role: weight.role,
          weights: weight.weights,
        },
      });
    }
    console.log('✅ Scoring weights seeded');

    // Seed basic muscles
    const muscles = [
      { code: 'chest', name: 'Chest' },
      { code: 'back', name: 'Back' },
      { code: 'shoulders', name: 'Shoulders' },
      { code: 'biceps', name: 'Biceps' },
      { code: 'triceps', name: 'Triceps' },
      { code: 'quads', name: 'Quadriceps' },
      { code: 'hamstrings', name: 'Hamstrings' },
      { code: 'glutes', name: 'Glutes' },
      { code: 'calves', name: 'Calves' },
      { code: 'abs', name: 'Abdominals' },
    ];

    for (const muscle of muscles) {
      await prisma.muscle.upsert({
        where: { code: muscle.code },
        update: { name: muscle.name },
        create: {
          code: muscle.code,
          name: muscle.name,
        },
      });
    }
    console.log('✅ Muscles seeded');

    // Seed basic equipment
    const equipment = [
      'Barbell',
      'Dumbbell',
      'Kettlebell',
      'Resistance Band',
      'Pull-up Bar',
      'Bodyweight',
      'Cable Machine',
      'Smith Machine',
    ];

    for (const eq of equipment) {
      await prisma.equipmentCatalog.upsert({
        where: { id: eq.toLowerCase().replace(/\s/g, '-') },
        update: {},
        create: {
          id: eq.toLowerCase().replace(/\s/g, '-'),
          name: eq,
        },
      });
    }
    console.log('✅ Equipment catalog seeded');

    // Seed common conditions for corrective exercises
    const conditions = [
      {
        code: 'lower_back_pain',
        nameFa: 'کمردرد',
        nameEn: 'Lower Back Pain',
        description: 'Pain and discomfort in the lower back region',
      },
      {
        code: 'knee_pain',
        nameFa: 'درد زانو',
        nameEn: 'Knee Pain',
        description: 'Pain and discomfort around the knee joint',
      },
      {
        code: 'shoulder_impingement',
        nameFa: 'گیرکردگی شانه',
        nameEn: 'Shoulder Impingement',
        description: 'Compression of shoulder tendons and bursa',
      },
    ];

    for (const condition of conditions) {
      await prisma.condition.upsert({
        where: { code: condition.code },
        update: {
          nameFa: condition.nameFa,
          nameEn: condition.nameEn,
          description: condition.description,
        },
        create: condition,
      });
    }
    console.log('✅ Conditions seeded');

    // Seed basic foods
    const foods = [
      {
        nameFa: 'مرغ',
        nameEn: 'Chicken Breast',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
      },
      {
        nameFa: 'برنج',
        nameEn: 'White Rice',
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
      },
      {
        nameFa: 'تخم‌مرغ',
        nameEn: 'Egg',
        calories: 155,
        protein: 13,
        carbs: 1.1,
        fat: 11,
        unitsJson: { whole: 50, white: 33 },
      },
    ];

    for (const food of foods) {
      await prisma.food.upsert({
        where: { id: food.nameEn.toLowerCase().replace(/\s/g, '-') },
        update: food,
        create: {
          id: food.nameEn.toLowerCase().replace(/\s/g, '-'),
          ...food,
        },
      });
    }
    console.log('✅ Foods seeded');

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
