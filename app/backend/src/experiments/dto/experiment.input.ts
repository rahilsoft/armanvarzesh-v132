
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ExperimentInput {
  @Field()
  name: string;
  @Field()
  hypothesis: string;
}
