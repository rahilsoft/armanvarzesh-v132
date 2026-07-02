import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsString, MinLength, IsOptional, IsInt } from 'class-validator';

@InputType()
export class CreateWorkoutPlanInput {
  @Field() @IsString() @MinLength(1)
  name!: string;

  @Field({ nullable: true }) @IsOptional() @IsString()
  description?: string;

  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt()
  userId?: number;
}

@InputType()
export class UpdateWorkoutPlanInput extends PartialType(CreateWorkoutPlanInput) {
  @Field(() => Int) @IsInt()
  id!: number;
}
