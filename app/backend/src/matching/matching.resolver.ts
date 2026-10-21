import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { MatchingService } from './matching.service';
import { PublicCoach, toPublicCoach } from '../coaches/entities/coach.entity';
import { GqlJwtAuthGuard } from './gql-jwt-auth.guard';

/**
 * GraphQL resolver exposing smart expert recommendations to authenticated
 * clients. Returns the public coach projection (no email/contact fields).
 */
@Resolver(() => PublicCoach)
export class MatchingResolver {
  constructor(private readonly matchingService: MatchingService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [PublicCoach], { name: 'recommendedCoaches' })
  async recommendedCoaches(
    @Args('expertise', { type: () => String, nullable: true }) expertise?: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 3 }) limit?: number,
    @Args('goals', { type: () => [String], nullable: true }) goals?: string[],
  ): Promise<PublicCoach[]> {
    const coaches = await this.matchingService.recommend(expertise, limit, goals ?? []);
    return coaches.map(toPublicCoach);
  }
}
