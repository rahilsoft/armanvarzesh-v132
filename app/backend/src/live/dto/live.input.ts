
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LiveInput {
  @Field()
  title: string;
  @Field({ nullable: true })
  description?: string;
}
