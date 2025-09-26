import { Injectable } from '@nestjs/common';
import { NutritionPlan } from './entities/plan.entity';

/**
 * In-memory storage service for nutrition plans.  This service
 * allows nutritionists to create simple plans associating a user
 * with a list of food items and quantities.  In a production
 * system this would interact with a persistent database via
 * Prisma or another ORM.
 */
@Injectable()
export class PlansService {
  private plans: NutritionPlan[] = [];

  /** Retrieve all plans for a given user. */
  findByUser(userId: number): NutritionPlan[] {
    return this.plans.filter((p) => p.userId === userId);
  }

  /**
   * Create a new nutrition plan.  Automatically assigns a new ID
   * and timestamps the creation date.
   */
  create(plan: { userId: number; items: { foodId: number; grams: number }[] }): NutritionPlan {
    const nextId = this.plans.length
      ? Math.max(...this.plans.map((p) => p.id)) + 1
      : 1;
    const newPlan: NutritionPlan = {
      id: nextId,
      userId: plan.userId,
      items: plan.items,
      createdAt: new Date(),
    };
    this.plans.push(newPlan);
    return newPlan;
  }
}