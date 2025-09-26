import { User } from '../../users/entities/user.entity';

import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class LeaderboardEntry {
  @Field(() => ID)
  id: number;
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
  @Field()
  date: Date;
  @Field(() => User, { nullable: true })
  user?: User | null;
}
