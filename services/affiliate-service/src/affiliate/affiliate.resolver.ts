import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AffiliateService, Affiliate } from './affiliate.service';

@Resolver(() => AffiliateObject)
export class AffiliateResolver {
  constructor(private readonly service: AffiliateService) {}

  @Mutation(() => AffiliateObject)
  createAffiliate(@Args('userId', { type: () => Int }) userId: number) {
    return this.service.createAffiliate(userId);
  }

  @Query(() => [AffiliateObject])
  affiliates() {
    return this.service.listAffiliates();
  }

  @Query(() => AffiliateObject, { nullable: true })
  affiliateByCode(@Args('code') code: string) {
    return this.service.getAffiliateByCode(code);
  }

  @Mutation(() => AffiliateObject)
  incrementRefCount(@Args('code') code: string) {
    return this.service.incrementRefCount(code);
  }
}

import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AffiliateObject implements Affiliate {
  @Field(() => Int)
  id: number;

  @Field()
  code: string;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  refCount: number;

  @Field()
  createdAt: Date;
}