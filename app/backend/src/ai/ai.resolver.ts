
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AiService } from './ai.service';
import { AiEntity } from './entities/ai.entity';
import { AiInput } from './dto/ai.input';

@Resolver(() => AiEntity)
export class AiResolver {
  constructor(private readonly aiService: AiService) {}

  @Query(() => AiEntity, { nullable: true })
  async latestAiPlan(@Args('userId', { type: () => Int }) userId: number) {
    return this.aiService.getLatestPlan(userId);
  }

  @Mutation(() => AiEntity)
  async generateWorkoutPlan(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('input') input: AiInput
  ) {
    return this.aiService.generateWorkoutPlan(userId, input);
  }

  /**
   * Generate a personalized nutrition plan for the user. Accepts the
   * same AiInput structure and delegates to the AI service. Returns
   * the generated plan record.
   */
  @Mutation(() => AiEntity)
  async generateNutritionPlan(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('input') input: AiInput
  ) {
    return this.aiService.generateNutritionPlan(userId, input);
  }
}
