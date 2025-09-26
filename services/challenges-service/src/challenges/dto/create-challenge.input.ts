import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsDate, IsInt } from 'class-validator';

@InputType()
export class CreateChallengeInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field()
  @IsNotEmpty()
  startDate: Date;

  @Field()
  @IsNotEmpty()
  endDate: Date;

  @Field(() => Int)
  @IsInt()
  createdBy: number;
}