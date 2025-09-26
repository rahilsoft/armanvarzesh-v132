
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Corporate {
  @Field(() => ID)
  id: number;
  @Field()
  companyName: string;
  @Field()
  industry: string;
  @Field()
  createdAt: Date;
}
