import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => Float)
  @IsNumber()
  price: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field(() => Int)
  @IsInt()
  createdBy: number;
}