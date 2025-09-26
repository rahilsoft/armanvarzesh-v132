import { Worker, Job } from 'bullmq';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import sharp from 'sharp';
import { execa } from 'execa';
import os from 'os';
import fs from 'fs';
import path from 'path';

const redis = { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } };
const s3 = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: !!process.env.S3_FORCE_PATH_STYLE,
  credentials: process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY ?
    { accessKeyId: process.env.S3_ACCESS_KEY!, secretAccessKey: process.env.S3_SECRET_KEY! } : undefined,
});

async function downloadToFile(bucket: string, key: string): Promise<string> {
  const out = path.join(os.tmpdir(), `media-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const body = res.Body as Readable;
  const ws = fs.createWriteStream(out);
  await pipeline(body, ws);
  return out;
}

async function uploadFromFile(bucket: string, key: string, filePath: string, contentType?: string) {
  const data = await fs.promises.readFile(filePath);
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: data, ContentType: contentType }));
}

async function processImageResize(job: Job) {
  const { bucket, key, width } = job.data;
  const tmpIn = await downloadToFile(bucket, key);
  const tmpOut = `${tmpIn}-out.webp`;
  await sharp(tmpIn).resize(width || 800).webp().toFile(tmpOut);
  const outKey = key.replace(/\.[^.]+$/, '') + '-800.webp';
  await uploadFromFile(bucket, outKey, tmpOut, 'image/webp');
  await fs.promises.unlink(tmpIn).catch(()=>{});
  await fs.promises.unlink(tmpOut).catch(()=>{});
  return { outKey };
}

async function processVideoTranscode(job: Job) {
  const { bucket, key } = job.data;
  const tmpIn = await downloadToFile(bucket, key);
  const tmpOut = `${tmpIn}-out.mp4`;
  await execa('ffmpeg', ['-y','-i', tmpIn, '-vf','scale=1280:-2', '-c:v','libx264', tmpOut]);
  const outKey = key.replace(/\.[^.]+$/, '') + '-1280.mp4';
  await uploadFromFile(bucket, outKey, tmpOut, 'video/mp4');
  await fs.promises.unlink(tmpIn).catch(()=>{});
  await fs.promises.unlink(tmpOut).catch(()=>{});
  return { outKey };
}

new Worker('media', async (job, { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, concurrency: parseInt(process.env.WORKER_CONCURRENCY||'4') }) => {
  if (job.name === 'resize') return processImageResize(job);
  if (job.name === 'transcode') return processVideoTranscode(job);
}, redis);
