
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCorrectiveVideoInput {
  @Field() title!: string;
  @Field() url!: string;
  @Field(() => [String]) conditions!: string[];
  @Field({ nullable:true }) voiceUrl?: string;
  @Field({ nullable:true }) equipment?: string;
  @Field({ nullable:true }) notes?: string;
  @Field() uploadedBy!: string;
}
