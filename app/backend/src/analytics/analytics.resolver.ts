
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import { AnalyticsEntity } from './entities/analytics.entity';
import { AnalyticsInput } from './dto/analytics.input';

@Resolver(() => AnalyticsEntity)
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => [AnalyticsEntity])
  async userKpis(@Args('userId', { type: () => Int }) userId: number) {
    return this.analyticsService.getKpis(userId);
  }

  @Mutation(() => AnalyticsEntity)
  async addKpi(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('input') input: AnalyticsInput
  ) {
    return this.analyticsService.addKpi(userId, input.kpi, input.value);
  }

  /**
   * Update an existing KPI entry by its ID. Only provided fields will be updated.
   */
  @Mutation(() => AnalyticsEntity)
  async updateKpi(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: AnalyticsInput
  ) {
    return this.analyticsService.update(id, input);
  }

  /**
   * Delete a KPI entry by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deleteKpi(@Args('id', { type: () => Int }) id: number) {
    return this.analyticsService.delete(id);
  }
}
