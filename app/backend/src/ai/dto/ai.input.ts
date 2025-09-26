
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AiInput {
  @Field()
  goal: string;
  @Field({ nullable: true })
  fitnessLevel?: string;
}
