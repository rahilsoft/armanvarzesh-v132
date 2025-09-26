
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CorporateInput {
  @Field()
  companyName: string;
  @Field()
  industry: string;
}
