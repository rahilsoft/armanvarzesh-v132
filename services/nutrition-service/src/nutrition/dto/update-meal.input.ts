import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Input type for updating a meal. Only the provided fields will be
 * updated; nutritional values will be recalculated if quantity or
 * foodItemId change.
 */
@InputType()
export class UpdateMealInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  foodItemId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}