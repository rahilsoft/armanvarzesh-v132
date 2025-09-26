import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType('ChallengeEntry')
export class ChallengeEntryType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  challengeId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  points: number;

  @Field()
  joinedAt: Date;
}