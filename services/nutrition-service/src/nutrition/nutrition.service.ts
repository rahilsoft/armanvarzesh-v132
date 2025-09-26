import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateFoodItemInput } from './dto/create-food-item.input';
import { UpdateFoodItemInput } from './dto/update-food-item.input';
import { CreateMealInput } from './dto/create-meal.input';
import { UpdateMealInput } from './dto/update-meal.input';
import { SetNutritionGoalInput } from './dto/set-nutrition-goal.input';

/**
 * Service providing business logic for the nutrition microservice. Handles
 * CRUD operations for food items and meals, management of nutrition goals
 * and computation of daily nutrition summaries.
 */
@Injectable()
export class NutritionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new food item definition. Calories and macronutrients are
   * provided per unit (e.g. per serving or 100g).
   */
  async createFoodItem(input: CreateFoodItemInput) {
    return this.prisma.foodItem.create({ data: input });
  }

  /**
   * Update an existing food item. Only provided fields will be updated.
   */
  async updateFoodItem(id: number, input: Partial<UpdateFoodItemInput>) {
    // Remove the id property from the update payload to avoid errors
    const { id: _, ...data } = input;
    return this.prisma.foodItem.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a food item by its identifier. Note: meals referencing this
   * food item will need to be handled at the application level.
   */
  async deleteFoodItem(id: number) {
    await this.prisma.foodItem.delete({ where: { id } });
    return true;
  }

  /**
   * Retrieve all food items.
   */
  async findAllFoodItems() {
    return this.prisma.foodItem.findMany();
  }

  /**
   * Retrieve a single food item by its identifier.
   */
  async findFoodItem(id: number) {
    return this.prisma.foodItem.findUnique({ where: { id } });
  }

  /**
   * Perform a case-insensitive search across food item names.
   */
  async searchFoodItems(term: string) {
    return this.prisma.foodItem.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20, 
      where: {
        name: {
          contains: term,
          mode: 'insensitive',
        },
      },
    });
  }

  /**
   * Find a food item by its barcode. Returns null if no item exists with
   * the provided barcode.
   */
  async findFoodItemByBarcode(barcode: string) {
    return this.prisma.foodItem.findFirst({ where: { barcode } });
  }

  /**
   * Create a meal for a user by providing a food item's barcode. Looks
   * up the food item by its barcode and then creates the meal with the
   * specified quantity. Throws an error if the barcode does not match
   * any defined food item.
   */
  async createMealByBarcode(userId: number, barcode: string, quantity: number, notes?: string) {
    const food = await this.findFoodItemByBarcode(barcode);
    if (!food) {
      throw new Error('Food item with provided barcode not found');
    }
    // Reuse createMeal logic by constructing a CreateMealInput-like object
    return this.createMeal({ userId, foodItemId: food.id, quantity, notes });
  }

  /**
   * Create a meal for a user. Nutritional values are calculated based on
   * the associated food item and quantity consumed.
   */
  async createMeal(input: CreateMealInput) {
    const food = await this.prisma.foodItem.findUnique({ where: { id: input.foodItemId } });
    if (!food) {
      throw new Error('Food item not found');
    }
    const quantity = input.quantity;
    const calories = food.calories * quantity;
    const protein = food.protein * quantity;
    const carbs = food.carbs * quantity;
    const fats = food.fats * quantity;
    return this.prisma.meal.create({
      data: {
        userId: input.userId,
        foodItemId: input.foodItemId,
        quantity,
        calories,
        protein,
        carbs,
        fats,
        notes: input.notes ?? undefined,
      },
      include: { foodItem: true },
    });
  }

  /**
   * Update an existing meal. If the food item or quantity is updated,
   * nutritional values are recalculated accordingly.
   */
  async updateMeal(id: number, input: UpdateMealInput) {
    // Retrieve existing meal to compute new values
    const existing = await this.prisma.meal.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Meal not found');
    }
    // Determine which food item to use
    const foodItemId = input.foodItemId ?? existing.foodItemId;
    const quantity = input.quantity ?? existing.quantity;
    const food = await this.prisma.foodItem.findUnique({ where: { id: foodItemId } });
    if (!food) {
      throw new Error('Food item not found');
    }
    const data: any = {};
    // If either quantity or food item changed, recalculate macros
    if (input.quantity !== undefined || input.foodItemId !== undefined) {
      data.quantity = quantity;
      data.foodItemId = foodItemId;
      data.calories = food.calories * quantity;
      data.protein = food.protein * quantity;
      data.carbs = food.carbs * quantity;
      data.fats = food.fats * quantity;
    }
    if (input.notes !== undefined) {
      data.notes = input.notes;
    }
    return this.prisma.meal.update({ where: { id }, data, include: { foodItem: true } });
  }

  /**
   * Delete a meal by its identifier.
   */
  async deleteMeal(id: number) {
    await this.prisma.meal.delete({ where: { id } });
    return true;
  }

  /**
   * Retrieve all meals logged by a specific user. Meals are returned in
   * descending order of consumption date.
   */
  async findMealsByUser(userId: number) {
    return this.prisma.meal.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20, 
      where: { userId },
      include: { foodItem: true },
      orderBy: { consumedAt: 'desc' },
    });
  }

  /**
   * Create or update a user's nutrition goal. Uses an upsert operation
   * keyed on userId so each user can only have a single active goal.
   */
  async setGoal(input: SetNutritionGoalInput) {
    return this.prisma.nutritionGoal.upsert({
      where: { userId: input.userId },
      update: {
        calories: input.calories,
        protein: input.protein,
        carbs: input.carbs,
        fats: input.fats,
      },
      create: {
        userId: input.userId,
        calories: input.calories,
        protein: input.protein,
        carbs: input.carbs,
        fats: input.fats,
      },
    });
  }

  /**
   * Retrieve a user's nutrition goal if it exists.
   */
  async getGoal(userId: number) {
    return this.prisma.nutritionGoal.findUnique({ where: { userId } });
  }

  /**
   * Compute the total calories and macronutrients consumed by a user on a
   * specific date. If no date is provided, the current day is used.
   */
  async getDailySummary(userId: number, date?: string) {
    let start: Date;
    let end: Date;
    if (date) {
      const d = new Date(date);
      start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    } else {
      const now = new Date();
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    }
    const meals = await this.prisma.meal.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20, 
      where: {
        userId,
        consumedAt: {
          gte: start,
          lte: end,
        },
      },
    });
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    for (const meal of meals) {
      totalCalories += meal.calories;
      totalProtein += meal.protein;
      totalCarbs += meal.carbs;
      totalFats += meal.fats;
    }
    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
    };
  }

  /**
   * Compute a user's progress towards their nutrition goals for a given day.
   * This method returns consumed totals, goal values and the ratio (0-1)
   * of consumption relative to each goal. If the user has not set a goal,
   * goal values default to zero and ratios default to zero.
   */
  async getDailyProgress(userId: number, date?: string) {
    const summary = await this.getDailySummary(userId, date);
    const goal = await this.getGoal(userId);
    const goalCalories = goal?.calories ?? 0;
    const goalProtein = goal?.protein ?? 0;
    const goalCarbs = goal?.carbs ?? 0;
    const goalFats = goal?.fats ?? 0;
    // Avoid division by zero
    const ratioCalories = goalCalories ? summary.totalCalories / goalCalories : 0;
    const ratioProtein = goalProtein ? summary.totalProtein / goalProtein : 0;
    const ratioCarbs = goalCarbs ? summary.totalCarbs / goalCarbs : 0;
    const ratioFats = goalFats ? summary.totalFats / goalFats : 0;
    return {
      totalCalories: summary.totalCalories,
      totalProtein: summary.totalProtein,
      totalCarbs: summary.totalCarbs,
      totalFats: summary.totalFats,
      goalCalories,
      goalProtein,
      goalCarbs,
      goalFats,
      ratioCalories,
      ratioProtein,
      ratioCarbs,
      ratioFats,
    };
  }
}