import { Resolver, Query, Args, Int, Float } from '@nestjs/graphql';
import { PredictiveService } from './predictive.service';

/**
 * Resolver exposing prediction functions for user motivation drop
 * probability and injury risk.
 */
@Resolver()
export class PredictiveResolver {
  constructor(private readonly predictiveService: PredictiveService) {}

  @Query(() => Float)
  async predictMotivationDrop(@Args('userId', { type: () => Int }) userId: number) {
    return this.predictiveService.predictMotivationDrop(userId);
  }

  @Query(() => Float)
  async predictInjuryRisk(@Args('userId', { type: () => Int }) userId: number) {
    return this.predictiveService.predictInjuryRisk(userId);
  }
}