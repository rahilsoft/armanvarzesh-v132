
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class MarketplaceInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Int)
  price: number;
}
