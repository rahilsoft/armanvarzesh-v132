
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateWorkoutInput } from './create-workout.input';

@InputType()
export class UpdateWorkoutInput extends PartialType(CreateWorkoutInput) {
  @Field(() => Int)
  id!: number;
}
