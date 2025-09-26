import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { AiService } from './ai.service';
import { WorkoutRecommendation } from './entities/workout-recommendation.entity';
import { NutritionRecommendation } from './entities/nutrition-recommendation.entity';

/**
 * GraphQL resolver exposing AI-driven workout recommendations.
 */
@Resolver()
export class AiResolver {
  constructor(private readonly aiService: AiService) {}

  /**
   * Generate a workout plan for a user. The returned plan contains
   * several recommended exercises tailored to the user's inferred
   * fitness level.
   */
  @Query(() => [WorkoutRecommendation])
  async generateWorkoutPlan(@Args('userId', { type: () => Int }) userId: number) {
    return this.aiService.generateWorkoutPlan(userId);
  }

  /**
   * Generate a nutrition plan for a user. Returns a list of food
   * recommendations with suggested servings and macro breakdown.
   */
  @Query(() => [NutritionRecommendation])
  async generateNutritionPlan(@Args('userId', { type: () => Int }) userId: number) {
    return this.aiService.generateNutritionPlan(userId);
  }
}