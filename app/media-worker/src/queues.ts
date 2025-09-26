import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';
import { env } from './env';

export type TranscodeJob = { inputUrl: string; outputKey: string; preset?: 'hls_720'|'mp4_720' };
export type ImageJob = { inputUrl: string; outputKey: string; format?: 'webp'|'avif'; width?: number; };

const connection = new IORedis(env.redisUrl);
export const transcodeQueue = new Queue<TranscodeJob>('media:transcode', { connection });
export const imageQueue = new Queue<ImageJob>('media:image', { connection });

export function defaultOpts(): JobsOptions {
  return { attempts: 3, backoff: { type: 'exponential', delay: 5000 }, removeOnComplete: 100, removeOnFail: 50 };
}

export function events(name: string) {
  return new QueueEvents(name, { connection });
}
