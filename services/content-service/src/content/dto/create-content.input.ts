import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl, IsInt } from 'class-validator';

@InputType()
export class CreateContentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field(() => Int)
  @IsInt()
  createdBy: number;
}