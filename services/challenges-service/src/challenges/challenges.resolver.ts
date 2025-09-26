import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChallengesService, Challenge, ChallengeEntry } from './challenges.service';
import { CreateChallengeInput } from './dto/create-challenge.input';
import { JoinChallengeInput } from './dto/join-challenge.input';
import { AddPointsInput } from './dto/add-points.input';
import { ChallengeType } from './entities/challenge.entity';
import { ChallengeEntryType } from './entities/challenge-entry.entity';

@Resolver()
export class ChallengesResolver {
  constructor(private readonly challengesService: ChallengesService) {}

  // Queries
  @Query(() => [ChallengeType])
  challenges() {
    return this.challengesService.getChallenges();
  }

  @Query(() => [ChallengeEntryType])
  leaderboard(@Args('challengeId', { type: () => Int }) challengeId: number) {
    return this.challengesService.getLeaderboard(challengeId);
  }

  // Mutations
  @Mutation(() => ChallengeType)
  createChallenge(@Args('input') input: CreateChallengeInput) {
    const { name, description, startDate, endDate, createdBy } = input;
    return this.challengesService.createChallenge(name, description, startDate, endDate, createdBy);
  }

  @Mutation(() => ChallengeEntryType)
  joinChallenge(@Args('input') input: JoinChallengeInput) {
    const { challengeId, userId } = input;
    return this.challengesService.joinChallenge(challengeId, userId);
  }

  @Mutation(() => ChallengeEntryType)
  addChallengePoints(@Args('input') input: AddPointsInput) {
    const { entryId, points } = input;
    return this.challengesService.addPoints(entryId, points);
  }
}