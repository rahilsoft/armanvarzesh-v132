
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChallengesService } from './challenges.service';
import { Challenge } from './entities/challenge.entity';
import { ChallengeInput } from './dto/challenge.input';

@Resolver(() => Challenge)
export class ChallengesResolver {
  constructor(private readonly challengesService: ChallengesService) {}

  @Query(() => [Challenge])
  async challenges() {
    return this.challengesService.findAll();
  }

  @Query(() => Challenge, { nullable: true })
  async challenge(@Args('id', { type: () => Int }) id: number) {
    return this.challengesService.findOne(id);
  }

  @Mutation(() => Challenge)
  async createChallenge(@Args('input') input: ChallengeInput) {
    return this.challengesService.create(input);
  }

  /**
   * Update an existing challenge. Returns the updated challenge.
   */
  @Mutation(() => Challenge)
  async updateChallenge(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: ChallengeInput
  ) {
    return this.challengesService.update(id, input);
  }

  /**
   * Delete a challenge by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deleteChallenge(@Args('id', { type: () => Int }) id: number) {
    return this.challengesService.delete(id);
  }

  @Mutation(() => Boolean)
  async joinChallenge(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('challengeId', { type: () => Int }) challengeId: number
  ) {
    return this.challengesService.join(userId, challengeId);
  }
}
