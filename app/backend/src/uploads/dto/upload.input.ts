import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUploadUrlInput {
  @Field() key: string;
  @Field() contentType: string;
}
