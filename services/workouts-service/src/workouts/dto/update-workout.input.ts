import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateWorkoutInput } from './create-workout.input';

/**
 * Input type for updating a workout session. Extends CreateWorkoutInput
 * and adds the id of the workout to be updated.
 */
@InputType()
export class UpdateWorkoutInput extends PartialType(CreateWorkoutInput) {
  @Field(() => Int)
  id: number;
}