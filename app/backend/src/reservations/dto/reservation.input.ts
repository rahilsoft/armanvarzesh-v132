import { InputType, Field } from '@nestjs/graphql';

/** The booking user is the authenticated principal, never an input field (REV-20261022-01). */
@InputType()
export class CreateReservationInput {
  @Field() coachId: string;
  @Field() slotId: string;
}
