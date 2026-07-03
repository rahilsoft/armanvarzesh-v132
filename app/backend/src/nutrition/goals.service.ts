import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NutritionGoal } from '@prisma/client';

/** Per-user macro targets (folded from services/nutrition-service). */
export interface SetNutritionGoalInput {
  userId: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

@Injectable()
export class NutritionGoalsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Create or update the user's single nutrition goal (upsert on userId). */
  async setGoal(input: SetNutritionGoalInput): Promise<NutritionGoal> {
    const { userId, calories, protein, carbs, fats } = input;
    return this.prisma.nutritionGoal.upsert({
      where: { userId },
      update: { calories, protein, carbs, fats },
      create: { userId, calories, protein, carbs, fats },
    });
  }

  async getGoal(userId: number): Promise<NutritionGoal | null> {
    return this.prisma.nutritionGoal.findUnique({ where: { userId } });
  }
}
