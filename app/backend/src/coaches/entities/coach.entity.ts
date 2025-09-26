
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Coach {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  expertise: string;

  @Field()
  createdAt: Date;
}
