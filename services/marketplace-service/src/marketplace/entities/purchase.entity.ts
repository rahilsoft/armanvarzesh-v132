import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType('MarketplacePurchase')
export class PurchaseType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  itemId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Float)
  price: number;

  @Field()
  purchasedAt: Date;
}