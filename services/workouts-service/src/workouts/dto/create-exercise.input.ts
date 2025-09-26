import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

/**
 * Input type for creating an exercise within a workout plan. The
 * planId and name are required; all other fields are optional.
 */
@InputType()
export class CreateExerciseInput {
  @Field(() => Int)
  @IsInt()
  planId: number;

  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  sets?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  reps?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  rpe?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  restTime?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}