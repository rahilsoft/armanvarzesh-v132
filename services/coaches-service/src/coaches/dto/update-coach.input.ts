import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateCoachInput } from './create-coach.input';

/**
 * Input type for updating a coach. Extends CreateCoachInput via
 * PartialType so all fields become optional, and adds the id of the
 * coach record to update.
 */
@InputType()
export class UpdateCoachInput extends PartialType(CreateCoachInput) {
  @Field(() => Int)
  id: number;
}