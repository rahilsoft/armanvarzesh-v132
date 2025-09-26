
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private client: S3Client | null = null;
  private ensure(){
    if (process.env.SKIP_AWS==='1') return null;
    this.client = this.client || new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
    return this.client;
  }

  async presignPut(folder:string, contentType:string){
    if (process.env.SKIP_AWS==='1'){
      // Dev fallback: return fake URL; client should still set `url` as-is
      const key = `${folder}/${randomUUID()}`;
      return { uploadUrl: `https://dev.local/${key}`, key };
    }
    const c = this.ensure()!;
    const key = `${folder}/${randomUUID()}`;
    const cmd = new PutObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key, ContentType: contentType });
    const uploadUrl = await getSignedUrl(c, cmd, { expiresIn: 900 });
    return { uploadUrl, key };
  }
}
