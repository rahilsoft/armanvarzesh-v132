import { ObjectType, Field, Float } from '@nestjs/graphql';

/**
 * GraphQL type representing the aggregated nutritional intake for a day.
 * Fields are totals across all meals consumed on the specified date.
 */
@ObjectType()
export class DailyNutritionSummary {
  @Field(() => Float)
  totalCalories: number;

  @Field(() => Float)
  totalProtein: number;

  @Field(() => Float)
  totalCarbs: number;

  @Field(() => Float)
  totalFats: number;
}