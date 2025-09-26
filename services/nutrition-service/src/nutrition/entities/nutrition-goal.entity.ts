import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

/**
 * GraphQL object type representing a user's daily nutrition goal.
 */
@ObjectType()
export class NutritionGoal {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Float)
  calories: number;

  @Field(() => Float)
  protein: number;

  @Field(() => Float)
  carbs: number;

  @Field(() => Float)
  fats: number;

  @Field()
  createdAt: Date;
}