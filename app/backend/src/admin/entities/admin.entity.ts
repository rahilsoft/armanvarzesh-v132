
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Admin {
  @Field(() => ID)
  id: number;
  @Field()
  email: string;
  @Field()
  name: string;
  @Field()
  createdAt: Date;
}
