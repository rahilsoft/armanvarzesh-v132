import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { NutritionService } from './nutrition.service';
import { FoodItem } from './entities/food-item.entity';
import { Meal } from './entities/meal.entity';
import { NutritionGoal } from './entities/nutrition-goal.entity';
import { DailyNutritionSummary } from './entities/daily-nutrition-summary.entity';
import { NutritionProgress } from './entities/nutrition-progress.entity';
import { CreateFoodItemInput } from './dto/create-food-item.input';
import { UpdateFoodItemInput } from './dto/update-food-item.input';
import { CreateMealInput } from './dto/create-meal.input';
import { UpdateMealInput } from './dto/update-meal.input';
import { SetNutritionGoalInput } from './dto/set-nutrition-goal.input';

/**
 * GraphQL resolver exposing the nutrition service operations. Provides
 * queries and mutations for managing food items, meals and nutrition goals.
 */
@Resolver()
export class NutritionResolver {
  constructor(private readonly nutritionService: NutritionService) {}

  // Food item resolvers
  @Mutation(() => FoodItem)
  async createFoodItem(@Args('data') data: CreateFoodItemInput) {
    return this.nutritionService.createFoodItem(data);
  }

  @Mutation(() => FoodItem)
  async updateFoodItem(@Args('id', { type: () => Int }) id: number, @Args('data') data: UpdateFoodItemInput) {
    return this.nutritionService.updateFoodItem(id, data);
  }

  @Mutation(() => Boolean)
  async deleteFoodItem(@Args('id', { type: () => Int }) id: number) {
    return this.nutritionService.deleteFoodItem(id);
  }

  @Query(() => [FoodItem])
  async foodItems() {
    return this.nutritionService.findAllFoodItems();
  }

  @Query(() => FoodItem, { nullable: true })
  async foodItem(@Args('id', { type: () => Int }) id: number) {
    return this.nutritionService.findFoodItem(id);
  }

  @Query(() => [FoodItem])
  async searchFoodItems(@Args('term') term: string) {
    return this.nutritionService.searchFoodItems(term);
  }

  /**
   * Query to retrieve a food item by its barcode. Returns null if no
   * matching item exists.
   */
  @Query(() => FoodItem, { nullable: true })
  async foodItemByBarcode(@Args('barcode') barcode: string) {
    return this.nutritionService.findFoodItemByBarcode(barcode);
  }

  // Meal resolvers
  @Mutation(() => Meal)
  async createMeal(@Args('data') data: CreateMealInput) {
    return this.nutritionService.createMeal(data);
  }

  /**
   * Mutation to create a meal by scanning a barcode instead of passing a
   * foodItemId. The service will look up the food item based on the
   * provided barcode and compute nutritional values accordingly.
   */
  @Mutation(() => Meal)
  async createMealByBarcode(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('barcode') barcode: string,
    @Args('quantity', { type: () => Float }) quantity: number,
    @Args('notes', { nullable: true }) notes?: string,
  ) {
    return this.nutritionService.createMealByBarcode(userId, barcode, quantity, notes);
  }

  @Mutation(() => Meal)
  async updateMeal(@Args('id', { type: () => Int }) id: number, @Args('data') data: UpdateMealInput) {
    return this.nutritionService.updateMeal(id, data);
  }

  @Mutation(() => Boolean)
  async deleteMeal(@Args('id', { type: () => Int }) id: number) {
    return this.nutritionService.deleteMeal(id);
  }

  @Query(() => [Meal])
  async mealsByUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.nutritionService.findMealsByUser(userId);
  }

  // Nutrition goal resolvers
  @Mutation(() => NutritionGoal)
  async setNutritionGoal(@Args('data') data: SetNutritionGoalInput) {
    return this.nutritionService.setGoal(data);
  }

  @Query(() => NutritionGoal, { nullable: true })
  async nutritionGoal(@Args('userId', { type: () => Int }) userId: number) {
    return this.nutritionService.getGoal(userId);
  }

  @Query(() => DailyNutritionSummary)
  async dailyNutritionSummary(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('date', { nullable: true }) date?: string,
  ) {
    return this.nutritionService.getDailySummary(userId, date);
  }

  /**
   * Query to retrieve a user's progress towards their daily nutrition goal.
   * Returns consumed totals, goal values and ratio of consumption to goal.
   */
  @Query(() => NutritionProgress)
  async dailyNutritionProgress(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('date', { nullable: true }) date?: string,
  ) {
    return this.nutritionService.getDailyProgress(userId, date);
  }
}