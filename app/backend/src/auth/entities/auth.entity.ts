
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  role: string;
}
