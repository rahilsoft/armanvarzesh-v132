
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AnalyticsInput {
  @Field()
  kpi: string;
  @Field(() => Int)
  value: number;
}
