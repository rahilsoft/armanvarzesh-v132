import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { FoodItem } from './food-item.entity';

/**
 * GraphQL object type representing a logged meal. A meal contains
 * a reference to the food item consumed, the quantity, computed
 * macronutrients and optional notes.
 */
@ObjectType()
export class Meal {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => FoodItem)
  foodItem: FoodItem;

  @Field(() => Int)
  foodItemId: number;

  @Field(() => Float)
  quantity: number;

  @Field(() => Float)
  calories: number;

  @Field(() => Float)
  protein: number;

  @Field(() => Float)
  carbs: number;

  @Field(() => Float)
  fats: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  consumedAt: Date;

  @Field()
  createdAt: Date;
}