import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateWorkoutPlanInput } from './create-workout-plan.input';

/**
 * Input type for updating a workout plan. Extends CreateWorkoutPlanInput
 * and adds a required id field.
 */
@InputType()
export class UpdateWorkoutPlanInput extends PartialType(CreateWorkoutPlanInput) {
  @Field(() => Int)
  id: number;
}