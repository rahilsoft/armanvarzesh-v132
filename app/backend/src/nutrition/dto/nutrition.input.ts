import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class FoodInput {
  @Field() title: string;
  @Field({ nullable: true }) barcode?: string;
  @Field(() => Float) protein: number;
  @Field(() => Float) carbs: number;
  @Field(() => Float) fat: number;
  @Field(() => Float) calories: number;
}

@InputType()
export class LogMealInput {
  @Field(() => Int) userId: number;
  @Field(() => Int) foodId: number;
  @Field(() => Int) grams: number;
}
