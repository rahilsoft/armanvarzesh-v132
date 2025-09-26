import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class EnrollInput {
  @Field(() => Int)
  @IsInt()
  courseId: number;

  @Field(() => Int)
  @IsInt()
  userId: number;
}