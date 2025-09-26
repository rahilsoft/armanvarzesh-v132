import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateExerciseInput } from './create-exercise.input';

/**
 * Input type for updating an exercise. Extends CreateExerciseInput and
 * adds the primary key id field.
 */
@InputType()
export class UpdateExerciseInput extends PartialType(CreateExerciseInput) {
  @Field(() => Int)
  id: number;
}