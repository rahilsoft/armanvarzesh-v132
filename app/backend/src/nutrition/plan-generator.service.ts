import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Food, NutritionPlan, NutritionPlanMealLog, NutritionTemplate, Prisma } from '@prisma/client';

/**
 * Nutrition planning — TDEE/macros (Mifflin-St Jeor), template-driven monthly
 * plan generation with per-item macro computation, and plan-meal check logs.
 * Folded from services/content-service (dismemberment step 3; cuid -> Int
 * PKs; injected PrismaService replaces its private `new PrismaClient()`).
 * The content "MealLog" is `NutritionPlanMealLog` here — a plan-meal check
 * log, distinct from the canonical food-quantity `MealLog`.
 */

export interface TDEEInput {
  sex: 'male' | 'female';
  age: number;
  weightKg: number;
  heightCm: number;
  activity: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE' | 'VERY_ACTIVE';
  goal?: 'cut' | 'bulk' | 'recomp' | 'maintain';
}

export interface MacroBreakdown { calories: number; protein: number; carbs: number; fat: number; grams: number }

interface TemplateItem { foodId: number; grams?: number; unit?: string; amount?: number; macros?: MacroBreakdown; food?: { id: number; nameFa: string | null; nameEn: string | null } }
interface TemplateMeal { name: string; items?: TemplateItem[] }
interface TemplateDay { meals?: TemplateMeal[]; totals?: Record<string, number> }

const ACTIVITY_FACTORS: Record<TDEEInput['activity'], number> = {
  SEDENTARY: 1.2, LIGHT: 1.375, MODERATE: 1.55, ACTIVE: 1.725, VERY_ACTIVE: 1.9,
};

@Injectable()
export class NutritionPlanGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  /** Mifflin-St Jeor BMR → TDEE → goal-adjusted target + macro suggestion
   *  (P 1.8g/kg, F 25% of calories, C remainder). Ported verbatim. */
  mifflin(input: TDEEInput): { bmr: number; tdee: number; targetCalories: number; macros: { protein: number; carbs: number; fat: number } } {
    const { sex, age, weightKg, heightCm, activity, goal } = input;
    const s = sex === 'male' ? 5 : -161;
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + s;
    const tdee = bmr * (ACTIVITY_FACTORS[activity] ?? 1.2);
    const delta = goal === 'cut' ? -0.15 : goal === 'bulk' ? +0.15 : 0;
    const target = Math.round(tdee * (1 + delta));
    const protein = Math.round(1.8 * weightKg);
    const fatCal = Math.round(target * 0.25);
    const fat = Math.round(fatCal / 9);
    const carbs = Math.max(0, Math.round((target - fatCal - protein * 4) / 4));
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), targetCalories: target, macros: { protein, carbs, fat } };
  }

  gramsFromUnit(unitsJson: unknown, unit: string, amount: number): number | null {
    if (!unitsJson) return null;
    const map = (typeof unitsJson === 'string' ? JSON.parse(unitsJson) : unitsJson) as Record<string, number>;
    const g = map[unit];
    return g ? g * amount : null;
  }

  calcFoodMacros(food: Pick<Food, 'calories' | 'protein' | 'carbs' | 'fat'>, grams: number): MacroBreakdown {
    const ratio = grams / 100;
    return {
      calories: +(food.calories * ratio).toFixed(1),
      protein: +(food.protein * ratio).toFixed(1),
      carbs: +(food.carbs * ratio).toFixed(1),
      fat: +(food.fat * ratio).toFixed(1),
      grams,
    };
  }

  dayTotals(day: TemplateDay): Record<string, number> {
    const sum = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    for (const meal of day.meals ?? []) {
      for (const it of meal.items ?? []) {
        sum.calories += it.macros?.calories ?? 0;
        sum.protein += it.macros?.protein ?? 0;
        sum.carbs += it.macros?.carbs ?? 0;
        sum.fat += it.macros?.fat ?? 0;
      }
    }
    return Object.fromEntries(Object.entries(sum).map(([k, v]) => [k, Math.round(v * 10) / 10]));
  }

  upsertTemplate(name: string, goal: string | undefined, json: Prisma.InputJsonValue, createdBy?: number): Promise<NutritionTemplate> {
    return this.prisma.nutritionTemplate.create({ data: { name, goal, json, createdBy } });
  }

  /** Generate a multi-week calendar plan from a template (macros computed per
   *  item from the canonical Food table, unit→grams conversion supported). */
  async generatePlanFromTemplate(userId: number, createdBy: number | undefined, template: { days?: TemplateDay[] }, startDate: Date, weeks = 4): Promise<NutritionPlan> {
    const foods = await this.prisma.food.findMany();
    const foodById = new Map(foods.map((f) => [f.id, f]));
    const baseDays: TemplateDay[] = template?.days?.length
      ? template.days
      : [{ meals: [{ name: 'breakfast', items: [] }, { name: 'lunch', items: [] }, { name: 'dinner', items: [] }] }];

    const days: TemplateDay[] = [];
    for (let w = 0; w < weeks; w++) {
      for (const base of baseDays) {
        const d: TemplateDay = JSON.parse(JSON.stringify(base));
        for (const meal of d.meals ?? []) {
          for (const it of meal.items ?? []) {
            const f = foodById.get(it.foodId);
            if (!f) continue;
            let grams = it.grams ?? 0;
            if (!grams && it.unit && it.amount) {
              grams = this.gramsFromUnit(f.unitsJson, it.unit, it.amount) ?? 0;
            }
            it.grams = grams;
            it.macros = this.calcFoodMacros(f, grams);
            it.food = { id: f.id, nameFa: f.nameFa, nameEn: f.nameEn };
          }
        }
        d.totals = this.dayTotals(d);
        days.push(d);
      }
    }

    const totals = {
      calories: Math.round(days.reduce((a, d) => a + (d.totals?.calories ?? 0), 0)),
      protein: Math.round(days.reduce((a, d) => a + (d.totals?.protein ?? 0), 0)),
      carbs: Math.round(days.reduce((a, d) => a + (d.totals?.carbs ?? 0), 0)),
      fat: Math.round(days.reduce((a, d) => a + (d.totals?.fat ?? 0), 0)),
    };

    return this.prisma.nutritionPlan.create({
      data: {
        userId, createdBy, startDate, weeks,
        json: { startDate: startDate.toISOString(), weeks, days } as unknown as Prisma.InputJsonValue,
        totalsJson: totals,
      },
    });
  }

  activePlan(userId: number): Promise<NutritionPlan | null> {
    return this.prisma.nutritionPlan.findFirst({ where: { userId, status: 'ACTIVE' }, orderBy: { createdAt: 'desc' } });
  }

  /** Check/uncheck a plan meal (idempotent upsert on plan+day+meal). */
  async markMealChecked(userId: number, planId: number, dayIndex: number, mealKey: string, checked: boolean, photoUrl?: string): Promise<NutritionPlanMealLog> {
    const plan = await this.prisma.nutritionPlan.findUnique({ where: { id: planId } });
    if (!plan || plan.userId !== userId) throw new BadRequestException('PLAN_NOT_FOUND_OR_FORBIDDEN');
    return this.prisma.nutritionPlanMealLog.upsert({
      where: { planId_dayIndex_mealKey: { planId, dayIndex, mealKey } },
      update: { checked, ...(photoUrl !== undefined ? { photoUrl } : {}) },
      create: { userId, planId, dayIndex, mealKey, checked, photoUrl },
    });
  }
}
