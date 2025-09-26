
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Meal {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  name: string;

  @Field(() => Int)
  kcal: number;

  @Field({ nullable: true })
  macros?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field()
  createdAt: Date;
}
