import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Wallet {
  @Field(() => ID)
  id!: number;

  @Field(() => Int)
  userId!: number;

  @Field(() => Int)
  balance!: number;

  @Field()
  createdAt!: Date;
}
