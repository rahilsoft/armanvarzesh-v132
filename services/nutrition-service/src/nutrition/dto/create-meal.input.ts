import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Input type for creating a meal. A meal associates a user with a food item
 * along with the quantity consumed. The nutritional values for the meal
 * are computed server-side based on the food item definition and quantity.
 */
@InputType()
export class CreateMealInput {
  @Field(() => Int)
  @IsInt()
  userId: number;

  @Field(() => Int)
  @IsInt()
  foodItemId: number;

  /**
   * Quantity of the food item consumed. The meaning of quantity is tied to
   * how nutritional values are defined for the food item (e.g. per serving
   * or per 100g).
   */
  @Field(() => Float)
  @IsNumber()
  quantity: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}