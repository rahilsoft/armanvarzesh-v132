import { Resolver, Query, Args, Mutation, Int, Float } from '@nestjs/graphql';
import { NutritionService } from './nutrition.service';
import { Food } from './entities/food.entity';
import { MealLog, DailySummary } from './entities/nutrition.entity';
import { FoodInput, LogMealInput } from './dto/nutrition.input';

@Resolver()
export class NutritionResolver {
  constructor(private readonly svc: NutritionService) {}

  @Query(() => [Food])
  foodSearch(@Args('q') q: string) { return this.svc.searchFoods(q); }

  @Query(() => Food, { nullable: true })
  foodByBarcode(@Args('barcode') barcode: string) { return this.svc.barcodeLookup(barcode); }

  @Mutation(() => Food)
  createFood(@Args('input') input: FoodInput) { return this.svc.createFood(input); }

  @Mutation(() => MealLog)
  logMeal(@Args('input') input: LogMealInput) { return this.svc.logMeal(input.userId, input.foodId, input.grams); }

  @Query(() => DailySummary)
  userDailyNutrition(@Args('userId', { type: () => Int }) userId: number, @Args('dateISO') dateISO: string) {
    return this.svc.dailySummary(userId, dateISO);
  }
}
