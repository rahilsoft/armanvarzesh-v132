import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VipService, VipUser } from './vip.service';

@Resolver(() => VipUserObject)
export class VipResolver {
  constructor(private readonly service: VipService) {}

  @Mutation(() => VipUserObject)
  upgradeUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('level') level: string,
  ) {
    return this.service.upgradeUser(userId, level);
  }

  @Query(() => [VipUserObject])
  vipUsers() {
    return this.service.listVipUsers();
  }
}

import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class VipUserObject implements VipUser {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  level: string;

  @Field()
  joinedAt: Date;
}