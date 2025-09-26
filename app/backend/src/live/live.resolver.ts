
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LiveService } from './live.service';
import { Live } from './entities/live.entity';
import { LiveInput } from './dto/live.input';

@Resolver(() => Live)
export class LiveResolver {
  constructor(private readonly liveService: LiveService) {}

  @Query(() => [Live])
  async liveSessions() {
    return this.liveService.findAll();
  }

  @Query(() => Live, { nullable: true })
  async liveSession(@Args('id', { type: () => Int }) id: number) {
    return this.liveService.findOne(id);
  }

  @Mutation(() => Live)
  async createLiveSession(@Args('input') input: LiveInput) {
    return this.liveService.create(input);
  }

  /**
   * Update an existing live session. Only provided fields are updated.
   */
  @Mutation(() => Live)
  async updateLiveSession(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: LiveInput
  ) {
    return this.liveService.update(id, input);
  }

  /**
   * End (delete) a live session by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async endLiveSession(@Args('id', { type: () => Int }) id: number) {
    return this.liveService.delete(id);
  }
}
