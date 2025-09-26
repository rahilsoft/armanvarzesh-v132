import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateReservationInput {
  @Field() userId: string;
  @Field() coachId: string;
  @Field() slotId: string;
}
