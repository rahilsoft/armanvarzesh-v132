
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class AnalyticsEntity {
  @Field(() => ID)
  id: number;
  @Field(() => Int)
  userId: number;
  @Field()
  kpi: string;
  @Field(() => Int)
  value: number;
  @Field()
  recordedAt: Date;
}
