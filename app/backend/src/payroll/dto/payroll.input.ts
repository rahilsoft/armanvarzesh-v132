
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class PayrollInput {
  @Field()
  coachName: string;
  @Field(() => Int)
  amount: number;
  @Field()
  period: string;
}
