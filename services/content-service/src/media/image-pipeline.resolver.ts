
import { Args, Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import sharp from 'sharp';

@ObjectType()
class PipelineResult {
  @Field() blurDataURL: string;
  @Field(() => [String]) variants: string[]; // URLs of generated variants (if uploaded), optional
}

async function fetchBuffer(url: string): Promise<Buffer>{
  const res = await fetch(url);
  if (!res.ok) throw new Error('fetch_failed');
  const arr = await res.arrayBuffer();
  return Buffer.from(arr);
}

@Resolver()
export class ImagePipelineResolver {
  @Query(() => PipelineResult)
  async makeImageVariants(@Args('url') url: string, @Args('maxWidth', { nullable: true }) maxWidth?: number){
    const buf = await fetchBuffer(url);
    const meta = await sharp(buf).metadata();
    const w = Math.min(maxWidth || 1600, meta.width || 1600);
    const thumb = await sharp(buf).resize(16).toBuffer();
    const blur = `data:image/jpeg;base64,${(await sharp(thumb).jpeg({ quality: 40 }).toBuffer()).toString('base64')}`;
    // Optionally, generate variants to S3 here (skipped for dev simplicity)
    return { blurDataURL: blur, variants: [] };
  }
}
