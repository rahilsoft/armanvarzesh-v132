import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAvailabilityInput {
  @Field() coachId: string;
  @Field() start: Date;
  @Field() end: Date;
  @Field({ nullable: true }) recurrence?: string;
}
