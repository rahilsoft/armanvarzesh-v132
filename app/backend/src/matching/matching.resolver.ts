import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { MatchingService } from './matching.service';
import { Coach } from '../coaches/entities/coach.entity';

/**
 * GraphQL resolver exposing smart expert recommendations to clients.
 * Delegates to MatchingService and simply converts arguments to
 * service calls.
 */
@Resolver(() => Coach)
export class MatchingResolver {
  constructor(private readonly matchingService: MatchingService) {}

  @Query(() => [Coach], { name: 'recommendedCoaches' })
  async recommendedCoaches(
    @Args('expertise', { type: () => String, nullable: true }) expertise?: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 3 }) limit?: number,
  ): Promise<Coach[]> {
    return this.matchingService.recommend(expertise, limit);
  }
}