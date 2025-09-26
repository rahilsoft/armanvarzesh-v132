import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UploadUrl {
  @Field() uploadUrl: string;
  @Field() key: string;
  @Field() expiresAt: string;
}

@ObjectType()
export class DownloadUrl {
  @Field() downloadUrl: string;
  @Field() key: string;
  @Field() expiresAt: string;
}
