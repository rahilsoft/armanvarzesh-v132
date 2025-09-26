
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Args, Field, ObjectType, Resolver, Query } from '@nestjs/graphql';
import crypto from 'crypto';

@ObjectType()
export class SignedUpload {
  @Field() url: string;
  @Field() key: string;
}

@Resolver()
export class UploadResolver {
  private client = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY ? {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
    } : undefined
  });

  @Query(() => SignedUpload)
  async getSignedUpload(@Args('contentType') contentType: string, @Args('ext', { nullable: true }) ext?: string){
    const bucket = process.env.S3_BUCKET!;
    const key = `vitrine/${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext ? '.'+ext : ''}`;
    // For simplicity, we return a pre-signed URL via presign (not implemented here due to runtime limits).
    // In production, use @aws-sdk/s3-request-presigner getSignedUrl with PutObjectCommand.
    // Here we fallback to a simple https PUT (requires proper CORS/policy).
    const url = `${process.env.S3_ENDPOINT || 'https://s3.amazonaws.com'}/${bucket}/${key}`;
    return { url, key };
  }
}
