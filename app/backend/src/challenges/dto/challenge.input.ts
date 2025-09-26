
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class ChallengeInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Int)
  duration: number;
}
