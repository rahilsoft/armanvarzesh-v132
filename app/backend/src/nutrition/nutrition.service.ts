import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { MealEntry, MealPlan, MacroTargets } from '@contracts/nutrition';

@Injectable()
export class NutritionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Authorisation guard: a user may only touch their own nutrition data;
   * coaches and admins may access anyone's.
   */
  ensureAccess(
    requesterId: string | number,
    targetUserId: string | number,
    role: 'user' | 'coach' | 'admin',
  ): void {
    if (role === 'admin' || role === 'coach') return;
    if (String(requesterId) !== String(targetUserId)) {
      throw new ForbiddenException('شما به این منبع دسترسی ندارید');
    }
  }

  async getMealPlan(_userId: string): Promise<MealPlan | null> {
    // A dedicated MealPlan table is not modelled yet; return null until one is.
    return null;
  }

  async setMealPlan(_userId: string, _plan: MealPlan): Promise<void> {
    // Placeholder: persist once a MealPlan table is introduced.
  }

  async addMealEntry(userId: string, entry: MealEntry): Promise<void> {
    const uid = Number(userId);
    for (const item of entry.items || []) {
      await this.prisma.mealLog.create({
        data: { userId: uid, foodId: Number(item.itemId), grams: item.grams },
      });
    }
  }

  async listMeals(userId: string, from?: string, to?: string): Promise<MealEntry[]> {
    const where: any = { userId: Number(userId) };
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lt = new Date(to);
    }
    const logs = await this.prisma.mealLog.findMany({ where, orderBy: { createdAt: 'desc' } });
    return logs.map((l) => ({
      id: String(l.id),
      userId: String(l.userId),
      date: l.createdAt.toISOString().slice(0, 10),
      items: [{ itemId: String(l.foodId), grams: l.grams }],
      createdAt: l.createdAt.toISOString(),
    }));
  }

  async computeDailyMacros(userId: string, date: string): Promise<MacroTargets> {
    const sum = await this.dailySummary(Number(userId), date);
    return { calories: sum.calories, protein: sum.protein, carbs: sum.carbs, fat: sum.fat };
  }

  async findAll() {
    return this.listFoods();
  }

  async findOne(id: string) {
    return this.prisma.food.findUnique({ where: { id: Number(id) } });
  }

  async searchFoods(q: string) {
    if (!q) return [];
    return this.prisma.food.findMany({ where: { title: { contains: q, mode: 'insensitive' } }, take: 25 });
  }

  async barcodeLookup(code: string) {
    return this.prisma.food.findUnique({ where: { barcode: code } });
  }

  /**
   * Retrieve the list of available food items.  Returns at most 100
   * records.  In a production system this would likely support
   * pagination and search parameters but is kept simple here.
   */
  async listFoods() {
    return this.prisma.food.findMany({ take: 100 });
  }

  async createFood(input: any) {
    return this.prisma.food.create({ data: input });
  }

  async logMeal(userId: number, foodId: number, grams: number) {
    return this.prisma.mealLog.create({ data: { userId, foodId, grams } });
  }

  async dailySummary(userId: number, dateISO: string) {
    const dayStart = new Date(dateISO);
    dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(dayStart.getTime() + 24*60*60*1000);
    const logs = await this.prisma.mealLog.findMany({
      where: { userId, createdAt: { gte: dayStart, lt: dayEnd } },
      include: { food: true }
    });
    const sum = logs.reduce((acc, l) => {
      const factor = l.grams / 100.0;
      acc.calories += l.food.calories * factor;
      acc.protein += l.food.protein * factor;
      acc.carbs   += l.food.carbs * factor;
      acc.fat     += l.food.fat * factor;
      return acc;
    }, { calories:0, protein:0, carbs:0, fat:0 });
    return sum;
  }

  /**
   * Calculate basal metabolic rate (BMR), total daily energy expenditure
   * (TDEE), and a basic macronutrient breakdown given user
   * characteristics.  Uses the Mifflin–St Jeor equation and a
   * simplified set of activity factors.  Macro distribution is
   * currently fixed at 40% carbohydrates, 30% protein and 30% fat.
   *
   * @param input An object containing weight (kg), height (cm),
   *              age (years), gender ('male'|'female') and
   *              activityLevel (one of 'sedentary','light','moderate','active','very').
   */
  calculatePlan(input: {
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very';
  }): { bmr: number; tdee: number; macros: { calories: number; protein: number; carbs: number; fat: number } } {
    const { weight, height, age, gender, activityLevel } = input;
    const s = gender === 'male' ? 5 : -161;
    const bmr = 10 * weight + 6.25 * height - 5 * age + s;
    const activityFactors: any = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very: 1.9,
    };
    const factor = activityFactors[activityLevel] ?? 1.2;
    const tdee = bmr * factor;
    // Macro distribution
    const calories = tdee;
    const protein = (0.3 * calories) / 4; // grams (4 cal/g)
    const carbs = (0.4 * calories) / 4;
    const fat = (0.3 * calories) / 9;
    return {
      bmr,
      tdee,
      macros: { calories, protein, carbs, fat },
    };
  }
}
