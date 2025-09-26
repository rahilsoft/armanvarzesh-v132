import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Reservation {
  @Field(() => ID) id: string;
  @Field() userId: string;
  @Field() coachId: string;
  @Field() slotId: string;
  @Field() status: string; // PENDING|CONFIRMED|CANCELED|COMPLETED
  @Field() start: Date;
  @Field() end: Date;
  @Field() createdAt: Date;
}
