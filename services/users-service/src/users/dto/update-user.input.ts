import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

/**
 * Input type used to update an existing user. It extends the create
 * input via Nest's PartialType helper so that all properties become
 * optional, and adds a required id field to locate the record to
 * update.
 */
@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;
}