import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsInt, IsNumber, IsString } from 'class-validator';

/**
 * Input type for logging a workout session. Requires a userId and
 * optionally a planId and other metrics.
 */
@InputType()
export class CreateWorkoutInput {
  @Field(() => Int)
  @IsInt()
  userId: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  planId?: number;

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
  @IsString()
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mediaUrl?: string;
}