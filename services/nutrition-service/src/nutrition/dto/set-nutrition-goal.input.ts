import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, IsNumber } from 'class-validator';

/**
 * Input type for creating or updating a user's nutrition goals. The goals
 * represent daily target values for calories and macronutrients.
 */
@InputType()
export class SetNutritionGoalInput {
  @Field(() => Int)
  @IsInt()
  userId: number;

  @Field(() => Float)
  @IsNumber()
  calories: number;

  @Field(() => Float)
  @IsNumber()
  protein: number;

  @Field(() => Float)
  @IsNumber()
  carbs: number;

  @Field(() => Float)
  @IsNumber()
  fats: number;
}