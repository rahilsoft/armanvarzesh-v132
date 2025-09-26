
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Experiment {
  @Field(() => ID)
  id: number;
  @Field()
  name: string;
  @Field()
  hypothesis: string;
  @Field()
  createdAt: Date;
}
