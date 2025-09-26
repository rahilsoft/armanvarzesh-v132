import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucket = process.env.S3_BUCKET || 'arman';
  private region = process.env.S3_REGION || 'us-east-1';

  constructor() {
    this.s3 = new S3Client({
      region: this.region,
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin'
      },
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE ? process.env.S3_FORCE_PATH_STYLE === 'true' : true
    });
  }

  async createUploadUrl(key: string, contentType: string, expiresIn = 900) {
    const cmd = new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType });
    const url = await getSignedUrl(this.s3, cmd, { expiresIn });
    return { uploadUrl: url, key, expiresAt: new Date(Date.now()+expiresIn*1000).toISOString() };
  }

  async createDownloadUrl(key: string, expiresIn = 900) {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const url = await getSignedUrl(this.s3, cmd, { expiresIn });
    return { downloadUrl: url, key, expiresAt: new Date(Date.now()+expiresIn*1000).toISOString() };
  }
}
