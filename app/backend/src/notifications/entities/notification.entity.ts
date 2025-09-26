
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: number;

  @Field()
  userId: number;

  @Field()
  text: string;

  @Field()
  read: boolean;

  @Field()
  createdAt: Date;
}
