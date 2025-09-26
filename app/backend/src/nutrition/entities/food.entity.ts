import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
@ObjectType()
export class Food {
  @Field(() => Int) id: number;
  @Field() title: string;
  @Field({ nullable: true }) barcode?: string;
  @Field(() => Float) protein: number;
  @Field(() => Float) carbs: number;
  @Field(() => Float) fat: number;
  @Field(() => Float) calories: number;
}
