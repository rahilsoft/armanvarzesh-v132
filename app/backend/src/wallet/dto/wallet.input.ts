import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class WalletInput {
  @Field(() => Int)
  userId!: number;

  @Field(() => Int)
  amount!: number;
}
