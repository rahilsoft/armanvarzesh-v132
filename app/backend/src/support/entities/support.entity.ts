
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Support {
  @Field(() => ID)
  id: number;
  @Field()
  userEmail: string;
  @Field()
  subject: string;
  @Field()
  message: string;
  @Field()
  status: string;
  @Field()
  createdAt: Date;
}
