import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

/**
 * GraphQL object type representing a food item. Each food item has
 * nutritional values per unit as defined in the database.
 */
@ObjectType()
export class FoodItem {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Float)
  calories: number;

  @Field(() => Float)
  protein: number;

  @Field(() => Float)
  carbs: number;

  @Field(() => Float)
  fats: number;

  @Field({ nullable: true })
  barcode?: string;

  @Field()
  createdAt: Date;
}