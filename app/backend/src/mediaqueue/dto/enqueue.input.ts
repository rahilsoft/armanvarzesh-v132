import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class EnqueueTranscodeInput {
  @Field() inputUrl: string;
  @Field() outputKey: string;
  @Field({ defaultValue: 'mp4_720' }) preset: 'hls_720' | 'mp4_720';
}

@InputType()
export class EnqueueImageInput {
  @Field() inputUrl: string;
  @Field() outputKey: string;
  @Field({ defaultValue: 'webp' }) format: 'webp' | 'avif';
  @Field(() => Int, { defaultValue: 1280 }) width: number;
}
