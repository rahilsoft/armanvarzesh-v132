
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Challenge {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Int)
  duration: number;

  @Field()
  createdAt: Date;
}
