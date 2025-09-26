import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class AddPointsInput {
  @Field(() => Int)
  @IsInt()
  entryId: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  points: number;
}