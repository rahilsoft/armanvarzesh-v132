
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class AiEntity {
  @Field(() => ID)
  id: number;

  @Field()
  userId: number;

  @Field()
  plan: string;

  @Field()
  createdAt: Date;
}
