
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Payment {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  amount: number;

  @Field()
  status: string;

  @Field()
  authority: string;

  @Field()
  createdAt: Date;
}
