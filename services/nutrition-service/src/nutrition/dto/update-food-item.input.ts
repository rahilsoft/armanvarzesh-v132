import { InputType, Field, Int, PartialType, Float } from '@nestjs/graphql';
import { CreateFoodItemInput } from './create-food-item.input';
import { IsNumber, IsOptional } from 'class-validator';

/**
 * Input type for updating a food item. Inherits optional fields from
 * CreateFoodItemInput via PartialType. The ID of the food item to
 * update must be provided separately in the resolver arguments.
 */
@InputType()
export class UpdateFoodItemInput extends PartialType(CreateFoodItemInput) {
  @Field(() => Int)
  @IsNumber()
  id: number;
}