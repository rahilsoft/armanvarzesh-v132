
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Payroll {
  @Field(() => ID)
  id: number;
  @Field()
  coachName: string;
  @Field(() => Int)
  amount: number;
  @Field()
  period: string;
  @Field()
  createdAt: Date;
}
