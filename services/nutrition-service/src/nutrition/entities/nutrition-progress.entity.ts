import { ObjectType, Field, Float } from '@nestjs/graphql';

/**
 * GraphQL type representing the progress of a user towards their daily
 * nutrition goals. Includes consumed totals, goal values and ratios
 * (progress percentage) for calories and macronutrients.
 */
@ObjectType()
export class NutritionProgress {
  @Field(() => Float)
  totalCalories: number;

  @Field(() => Float)
  totalProtein: number;

  @Field(() => Float)
  totalCarbs: number;

  @Field(() => Float)
  totalFats: number;

  @Field(() => Float)
  goalCalories: number;

  @Field(() => Float)
  goalProtein: number;

  @Field(() => Float)
  goalCarbs: number;

  @Field(() => Float)
  goalFats: number;

  @Field(() => Float)
  ratioCalories: number;

  @Field(() => Float)
  ratioProtein: number;

  @Field(() => Float)
  ratioCarbs: number;

  @Field(() => Float)
  ratioFats: number;
}