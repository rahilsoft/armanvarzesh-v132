
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Marketplace {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Int)
  price: number;

  @Field()
  createdAt: Date;
}
