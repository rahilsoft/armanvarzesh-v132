import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, IsInt } from 'class-validator';

@InputType()
export class UpdateContentInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;
}