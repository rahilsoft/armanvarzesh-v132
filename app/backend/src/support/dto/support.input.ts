
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SupportInput {
  @Field()
  userEmail: string;
  @Field()
  subject: string;
  @Field()
  message: string;
}
