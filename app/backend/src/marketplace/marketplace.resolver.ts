
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MarketplaceService } from './marketplace.service';
import { Marketplace } from './entities/marketplace.entity';
import { MarketplaceInput } from './dto/marketplace.input';

@Resolver(() => Marketplace)
export class MarketplaceResolver {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Query(() => [Marketplace])
  async marketplaceItems() {
    return this.marketplaceService.findAll();
  }

  @Query(() => Marketplace, { nullable: true })
  async marketplaceItem(@Args('id', { type: () => Int }) id: number) {
    return this.marketplaceService.findOne(id);
  }

  @Mutation(() => Marketplace)
  async createMarketplaceItem(@Args('input') input: MarketplaceInput) {
    return this.marketplaceService.create(input);
  }

  @Mutation(() => Marketplace)
  async updateMarketplaceItem(@Args('id', { type: () => Int }) id: number, @Args('input') input: MarketplaceInput) {
    return this.marketplaceService.update(id, input);
  }

  /**
   * Delete a marketplace item by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deleteMarketplaceItem(@Args('id', { type: () => Int }) id: number) {
    return this.marketplaceService.delete(id);
  }
}
