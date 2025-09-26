
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class PaymentInput {
  @Field(() => Int)
  amount: number;

  @Field()
  description: string;

  @Field()
  callbackUrl: string;
}
