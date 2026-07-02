
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Marketplace {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Int)
  price: number;

  // Folded from the former marketplace-service.
  @Field({ nullable: true })
  type?: string | null;

  @Field(() => Int, { nullable: true })
  createdBy?: number | null;

  @Field()
  createdAt: Date;
}
