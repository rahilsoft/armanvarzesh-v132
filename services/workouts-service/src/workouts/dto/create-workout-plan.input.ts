import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt } from 'class-validator';

/**
 * Input type for creating a workout plan. Only the name is required;
 * description and userId are optional.
 */
@InputType()
export class CreateWorkoutPlanInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  userId?: number;
}