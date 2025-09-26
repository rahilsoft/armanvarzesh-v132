import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
@ObjectType()
export class MealLog {
  @Field(() => Int) id: number;
  @Field(() => Int) userId: number;
  @Field(() => Int) foodId: number;
  @Field(() => Int) grams: number;
  @Field() createdAt: Date;
}

@ObjectType()
export class DailySummary {
  @Field(() => Float) calories: number;
  @Field(() => Float) protein: number;
  @Field(() => Float) carbs: number;
  @Field(() => Float) fat: number;
}
