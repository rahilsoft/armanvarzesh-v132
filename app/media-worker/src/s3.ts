import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'node:fs';

export const s3 = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin'
  },
  forcePathStyle: (process.env.S3_FORCE_PATH_STYLE || 'true') === 'true'
});

export async function uploadFile(bucket: string, key: string, filePath: string, contentType: string) {
  const Body = createReadStream(filePath);
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body, ContentType: contentType }));
  return { bucket, key };
}
