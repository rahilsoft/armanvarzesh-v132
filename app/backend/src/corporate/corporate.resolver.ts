
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CorporateService } from './corporate.service';
import { Corporate } from './entities/corporate.entity';
import { CorporateInput } from './dto/corporate.input';

@Resolver(() => Corporate)
export class CorporateResolver {
  constructor(private readonly corporateService: CorporateService) {}

  @Query(() => [Corporate])
  async corporates() {
    return this.corporateService.findAll();
  }

  @Query(() => Corporate, { nullable: true })
  async corporate(@Args('id', { type: () => Int }) id: number) {
    return this.corporateService.findOne(id);
  }

  @Mutation(() => Corporate)
  async createCorporate(@Args('input') input: CorporateInput) {
    return this.corporateService.create(input);
  }

  /**
   * Update an existing corporate entity. Returns the updated corporate.
   */
  @Mutation(() => Corporate)
  async updateCorporate(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: CorporateInput
  ) {
    return this.corporateService.update(id, input);
  }

  /**
   * Delete a corporate entry by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deleteCorporate(@Args('id', { type: () => Int }) id: number) {
    return this.corporateService.delete(id);
  }
}
