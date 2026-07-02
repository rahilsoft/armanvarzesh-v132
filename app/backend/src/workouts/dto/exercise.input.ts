import { InputType, Field, Int, Float, PartialType } from '@nestjs/graphql';
import { IsString, MinLength, IsOptional, IsInt, IsNumber } from 'class-validator';

@InputType()
export class CreateExerciseInput {
  @Field(() => Int) @IsInt()
  planId!: number;

  @Field() @IsString() @MinLength(1)
  name!: string;

  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt()
  sets?: number;

  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt()
  reps?: number;

  @Field(() => Float, { nullable: true }) @IsOptional() @IsNumber()
  weight?: number;

  @Field(() => Float, { nullable: true }) @IsOptional() @IsNumber()
  rpe?: number;

  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt()
  restTime?: number;

  @Field({ nullable: true }) @IsOptional() @IsString()
  notes?: string;
}

@InputType()
export class UpdateExerciseInput extends PartialType(CreateExerciseInput) {
  @Field(() => Int) @IsInt()
  id!: number;
}
