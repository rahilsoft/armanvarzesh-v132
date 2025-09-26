import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType('MarketplaceItem')
export class ItemType {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field()
  type: string;

  @Field(() => Int)
  createdBy: number;

  @Field()
  createdAt: Date;
}