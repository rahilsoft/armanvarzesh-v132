import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, IsNumber } from 'class-validator';

@InputType()
export class RecordResultInput {
  @Field(() => Int)
  @IsInt()
  testId: number;

  @Field(() => Int)
  @IsInt()
  userId: number;

  @Field(() => Float)
  @IsNumber()
  score: number;
}