
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Live {
  @Field(() => ID)
  id: number;
  @Field()
  title: string;
  @Field({ nullable: true })
  description?: string;
  @Field()
  startedAt: Date;
}
