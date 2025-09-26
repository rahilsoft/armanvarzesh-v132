import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { env } from './env';
import { transcodeQueue, imageQueue, defaultOpts, events } from './queues';
import { runFFmpeg, hls720, mp4720, imgWebp, imgAvif } from './ffmpeg';
import { createWriteStream } from 'node:fs';
import { uploadFile } from './s3';
import { randomUUID } from 'node:crypto';

const connection = new IORedis(env.redisUrl);
const tmp = '/tmp';
const BUCKET = process.env.S3_BUCKET || 'arman';

async function transcode(job: Job) {
  const { inputUrl, outputKey, preset } = job.data;
  const out = `${tmp}/${randomUUID()}`;
  let args: string[];
  if (preset === 'hls_720') args = hls720(inputUrl, `${out}.m3u8`);
  else args = mp4720(inputUrl, `${out}.mp4`);
  await runFFmpeg(args);
  // TODO: upload to object storage; placeholder write
  return { output: outputKey, preset: preset || 'mp4_720' };
}

async function processImage(job: Job) {
  const { inputUrl, outputKey, format='webp', width=1280 } = job.data;
  const out = `${tmp}/${randomUUID()}.${format}`;
  let args = format === 'webp' ? imgWebp(inputUrl, out, width) : imgAvif(inputUrl, out, width);
  await runFFmpeg(args);
  return { output: outputKey, format, width };
}

new Worker('media:transcode', transcode, { connection, concurrency: env.concurrency }, { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, concurrency: parseInt(process.env.WORKER_CONCURRENCY||'4') });
new Worker('media:image', processImage, { connection, concurrency: env.concurrency }, { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, concurrency: parseInt(process.env.WORKER_CONCURRENCY||'4') });

events('media:transcode');
events('media:image');

console.log('[media-worker] started with concurrency', env.concurrency);
