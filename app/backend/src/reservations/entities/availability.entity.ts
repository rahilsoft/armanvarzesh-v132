import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class AvailabilitySlot {
  @Field(() => ID) id: string;
  @Field() coachId: string;
  @Field() start: Date;
  @Field() end: Date;
  @Field({ nullable: true }) recurrence?: string; // RRULE string
  @Field() createdAt: Date;
}
