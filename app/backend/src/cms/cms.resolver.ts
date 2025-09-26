
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CmsService } from './cms.service';
import { Cms } from './entities/cms.entity';
import { CmsInput } from './dto/cms.input';

@Resolver(() => Cms)
export class CmsResolver {
  constructor(private readonly cmsService: CmsService) {}

  @Query(() => [Cms])
  async contents() {
    return this.cmsService.findAll();
  }

  @Query(() => Cms, { nullable: true })
  async content(@Args('id', { type: () => Int }) id: number) {
    return this.cmsService.findOne(id);
  }

  @Mutation(() => Cms)
  async createContent(@Args('input') input: CmsInput) {
    return this.cmsService.create(input);
  }

  /**
   * Update an existing CMS content entry. Returns the updated record.
   */
  @Mutation(() => Cms)
  async updateContent(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: CmsInput
  ) {
    return this.cmsService.update(id, input);
  }

  /**
   * Delete a CMS content entry by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deleteContent(@Args('id', { type: () => Int }) id: number) {
    return this.cmsService.delete(id);
  }
}
