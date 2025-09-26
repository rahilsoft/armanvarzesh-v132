
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Survey {
  @Field(() => ID)
  id: number;
  @Field()
  title: string;
  @Field()
  question: string;
  @Field()
  createdAt: Date;
}
