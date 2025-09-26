import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RewardService, Reward, UserReward } from './reward.service';

@Resolver(() => RewardObject)
export class RewardResolver {
  constructor(private readonly service: RewardService) {}

  @Mutation(() => RewardObject)
  createReward(
    @Args('title') title: string,
    @Args('xp', { type: () => Int }) xp: number,
  ) {
    return this.service.createReward(title, xp);
  }

  @Query(() => [RewardObject])
  rewards() {
    return this.service.listRewards();
  }

  @Mutation(() => UserRewardObject)
  grantReward(
    @Args('rewardId', { type: () => Int }) rewardId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.service.grantRewardToUser(rewardId, userId);
  }

  @Query(() => [UserRewardObject])
  userRewards(@Args('userId', { type: () => Int }) userId: number) {
    return this.service.userRewardsByUser(userId);
  }
}

import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RewardObject implements Reward {
  @Field(() => Int)
  id: number;
  @Field()
  title: string;
  @Field(() => Int)
  xp: number;
  @Field()
  createdAt: Date;
}

@ObjectType()
export class UserRewardObject implements UserReward {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  userId: number;
  @Field(() => Int)
  rewardId: number;
  @Field()
  grantedAt: Date;
}