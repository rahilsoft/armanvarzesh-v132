import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

/**
 * Input type for creating a food item. Each food item represents a basic
 * ingredient with known macronutrient values per unit. The quantity unit
 * is abstract (e.g. per serving or per 100g) and should be consistent across
 * the application.
 */
@InputType()
export class CreateFoodItemInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

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

  /**
   * Optional barcode identifier for scanning foods. When provided, this
   * value can be used by clients to look up the item via barcode.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  barcode?: string;
}