
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateConditionInput {
  @Field() code!: string;
  @Field() nameFa!: string;
  @Field({ nullable:true }) nameEn?: string;
  @Field({ nullable:true }) description?: string;
}
