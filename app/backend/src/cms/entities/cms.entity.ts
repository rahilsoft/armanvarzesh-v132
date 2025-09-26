
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Cms {
  @Field(() => ID)
  id: number;
  @Field()
  title: string;
  @Field()
  body: string;
  @Field({ nullable: true })
  category?: string;
  @Field()
  createdAt: Date;
}
