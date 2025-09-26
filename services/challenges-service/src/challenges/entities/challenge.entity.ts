import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType('Challenge')
export class ChallengeType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(() => Int)
  createdBy: number;
}