import { BadRequestException } from '@nestjs/common';
import { NutritionPlanGeneratorService } from '../plan-generator.service';

/** Nutrition planning fold: Mifflin TDEE, unit→grams, macro math, template
 *  expansion across weeks, meal-check upsert with ownership guard. */
function makePrismaMock() {
  const foods: any[] = [];
  const plans: any[] = [];
  const logs: any[] = [];
  let seq = 1;
  return {
    _plans: plans, _logs: logs, _foods: foods,
    food: { findMany: async () => foods },
    nutritionTemplate: { create: async ({ data }: any) => ({ id: seq++, ...data }) },
    nutritionPlan: {
      create: async ({ data }: any) => { const p = { id: seq++, status: 'ACTIVE', ...data }; plans.push(p); return p; },
      findUnique: async ({ where }: any) => plans.find((p) => p.id === where.id) ?? null,
      findFirst: async ({ where }: any) => plans.find((p) => p.userId === where.userId && p.status === where.status) ?? null,
    },
    nutritionPlanMealLog: {
      upsert: async ({ where, update, create }: any) => {
        const k = where.planId_dayIndex_mealKey;
        let l = logs.find((x) => x.planId === k.planId && x.dayIndex === k.dayIndex && x.mealKey === k.mealKey);
        if (l) Object.assign(l, update); else { l = { id: seq++, ...create }; logs.push(l); }
        return l;
      },
    },
  };
}

describe('NutritionPlanGeneratorService (content dismemberment step 3)', () => {
  it('computes Mifflin TDEE with goal adjustment and macro split', () => {
    const svc = new NutritionPlanGeneratorService(makePrismaMock() as any);
    const r = svc.mifflin({ sex: 'male', age: 30, weightKg: 80, heightCm: 180, activity: 'MODERATE', goal: 'cut' });
    expect(r.bmr).toBe(1780);           // 800+1125-150+5
    expect(r.tdee).toBe(2759);          // 1780*1.55
    expect(r.targetCalories).toBe(2345); // -15%
    expect(r.macros.protein).toBe(144);  // 1.8*80
    expect(r.macros.fat).toBe(65);       // 25% cal / 9
  });

  it('expands a template across weeks with per-item macros and totals', async () => {
    const prisma = makePrismaMock();
    prisma._foods.push({ id: 1, nameFa: 'مرغ', nameEn: 'chicken', calories: 165, protein: 31, carbs: 0, fat: 3.6, unitsJson: { piece: 120 } });
    const svc = new NutritionPlanGeneratorService(prisma as any);
    const template = { days: [{ meals: [{ name: 'lunch', items: [{ foodId: 1, unit: 'piece', amount: 2 }] }] }] };
    const plan = await svc.generatePlanFromTemplate(9, 1, template, new Date('2026-07-06'), 2);
    const json = plan.json as any;
    expect(json.days).toHaveLength(2); // 1 template day × 2 weeks
    const item = json.days[0].meals[0].items[0];
    expect(item.grams).toBe(240); // 2 pieces × 120g
    expect(item.macros.protein).toBeCloseTo(74.4);
    expect((plan.totalsJson as any).protein).toBe(Math.round(74.4 * 2));
  });

  it('meal check is an idempotent upsert guarded by plan ownership', async () => {
    const prisma = makePrismaMock();
    const svc = new NutritionPlanGeneratorService(prisma as any);
    const plan = await svc.generatePlanFromTemplate(4, 1, {}, new Date(), 1);
    await expect(svc.markMealChecked(5, plan.id, 0, 'lunch', true)).rejects.toBeInstanceOf(BadRequestException);
    await svc.markMealChecked(4, plan.id, 0, 'lunch', true);
    await svc.markMealChecked(4, plan.id, 0, 'lunch', false); // toggle updates same row
    expect(prisma._logs).toHaveLength(1);
    expect(prisma._logs[0].checked).toBe(false);
    expect((await svc.activePlan(4))?.id).toBe(plan.id);
  });
});
