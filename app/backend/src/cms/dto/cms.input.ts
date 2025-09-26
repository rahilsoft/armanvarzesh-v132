
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CmsInput {
  @Field()
  title: string;
  @Field()
  body: string;
  @Field({ nullable: true })
  category?: string;
}
