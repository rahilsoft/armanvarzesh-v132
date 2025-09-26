
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class NotificationInput {
  @Field()
  text: string;

  @Field({ defaultValue: false })
  isCritical?: boolean;
}
