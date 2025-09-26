
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class LeaderboardInput {
  @Field(() => Int)
  userId: number;
  @Field(() => Int)
  xp: number;
  @Field(() => Int)
  calories: number;
  @Field(() => Int)
  sessions: number;
  @Field()
  timeframe: string;
}
