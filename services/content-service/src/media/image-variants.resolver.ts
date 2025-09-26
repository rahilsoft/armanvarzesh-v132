
import { Args, Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@ObjectType()
class VariantFile {
  @Field() url: string;
  @Field() format: string; // avif | webp
  @Field() width: number;
}

@ObjectType()
class VariantsResult {
  @Field(() => [VariantFile]) files: VariantFile[];
  @Field({ nullable: true }) blurDataURL?: string;
}

async function fetchBuffer(url: string): Promise<Buffer>{
  const res = await fetch(url);
  if (!res.ok) throw new Error('fetch_failed');
  const arr = await res.arrayBuffer();
  return Buffer.from(arr);
}

function makeKey(baseKey: string, width: number, fmt: string){
  const dot = baseKey.lastIndexOf('.');
  const stem = dot >= 0 ? baseKey.slice(0, dot) : baseKey;
  return `${stem}_${width}.${fmt}`;
}

@Resolver()
export class ImageVariantsResolver {
  private s3 = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY ? {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
    } : undefined
  });

  @Query(() => VariantsResult)
  async makeImageVariantsFull(
    @Args('url') url: string,
    @Args('widths', { type: () => [Number], nullable: true }) widths?: number[],
    @Args('bucketPrefix', { nullable: true }) bucketPrefix?: string
  ){
    const buf = await fetchBuffer(url);
    const meta = await sharp(buf).metadata();
    const maxW = meta.width || 1600;
    const ws = (widths && widths.length ? widths : [480, 768, 1080, 1440, 1920]).filter(w => w <= maxW);
    const out: VariantFile[] = [];
    const bucket = process.env.S3_BUCKET;
    const baseKey = (bucketPrefix || 'vitrine') + '/' + Date.now().toString(36);
    // blur
    const tiny = await sharp(buf).resize(16).jpeg({ quality: 40 }).toBuffer();
    const blurDataURL = `data:image/jpeg;base64,${tiny.toString('base64')}`;
    for (const w of ws){
      const avif = await sharp(buf).resize(w).avif({ quality: 55 }).toBuffer();
      const webp = await sharp(buf).resize(w).webp({ quality: 75 }).toBuffer();
      if (bucket){
        const keyA = makeKey(baseKey, w, 'avif');
        const keyW = makeKey(baseKey, w, 'webp');
        await this.s3.send(new PutObjectCommand({ Bucket: bucket, Key: keyA, Body: avif, ContentType: 'image/avif', CacheControl: 'public, max-age=31536000, immutable' }));
        await this.s3.send(new PutObjectCommand({ Bucket: bucket, Key: keyW, Body: webp, ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable' }));
        const baseUrl = process.env.PUBLIC_MEDIA_BASE || (process.env.S3_ENDPOINT ? `${process.env.S3_ENDPOINT}/${bucket}` : `https://${bucket}.s3.amazonaws.com`);
        out.push({ url: `${baseUrl}/${keyA}`, format: 'avif', width: w });
        out.push({ url: `${baseUrl}/${keyW}`, format: 'webp', width: w });
      }else{
        // As a dev fallback, return data URLs
        out.push({ url: `data:image/avif;base64,${avif.toString('base64')}`, format: 'avif', width: w });
        out.push({ url: `data:image/webp;base64,${webp.toString('base64')}`, format: 'webp', width: w });
      }
    }
    return { files: out, blurDataURL };
  }
}
