
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SearchCorrectiveInput {
  @Field({ nullable:true }) q?: string;
  @Field(() => [String], { nullable:true }) conditions?: string[];
  @Field({ nullable:true }) equipment?: string;
  @Field({ nullable:true }) approvedOnly?: boolean;
}
