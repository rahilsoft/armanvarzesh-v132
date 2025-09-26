import { ObjectType, Field, Float } from '@nestjs/graphql';

/**
 * GraphQL object type representing a recommended food item as part of
 * a personalized nutrition plan. Servings refer to the number of units
 * suggested for the user.
 */
@ObjectType()
export class NutritionRecommendation {
  @Field()
  foodName: string;

  @Field(() => Float)
  servings: number;

  @Field(() => Float)
  calories: number;

  @Field(() => Float)
  protein: number;

  @Field(() => Float)
  carbs: number;

  @Field(() => Float)
  fats: number;
}