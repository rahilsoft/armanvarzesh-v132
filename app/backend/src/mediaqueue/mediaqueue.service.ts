import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class MediaQueueService {
  private conn = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379/1');
  private transcodeQ = new Queue('media:transcode', { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, defaultJobOptions: { attempts: parseInt(process.env.BULLMQ_DEFAULT_ATTEMPTS||'5'), backoff: { type: 'exponential', delay: parseInt(process.env.BULLMQ_BACKOFF_MS||'5000') }, removeOnComplete: parseInt(process.env.BULLMQ_REMOVE_ON_COMPLETE||'1000'), removeOnFail: parseInt(process.env.BULLMQ_REMOVE_ON_FAIL||'5000') },  connection: this.conn });
  private imageQ = new Queue('media:image', { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, defaultJobOptions: { attempts: parseInt(process.env.BULLMQ_DEFAULT_ATTEMPTS||'5'), backoff: { type: 'exponential', delay: parseInt(process.env.BULLMQ_BACKOFF_MS||'5000') }, removeOnComplete: parseInt(process.env.BULLMQ_REMOVE_ON_COMPLETE||'1000'), removeOnFail: parseInt(process.env.BULLMQ_REMOVE_ON_FAIL||'5000') },  connection: this.conn });

  async enqueueTranscode(inputUrl: string, outputKey: string, preset: 'hls_720' | 'mp4_720' = 'mp4_720') {
    const job = await this.transcodeQ.add('transcode', { inputUrl, outputKey, preset }, { attempts: 3, removeOnComplete: true });
    return { id: job.id, name: job.name };
  }

  async enqueueImage(inputUrl: string, outputKey: string, format: 'webp' | 'avif' = 'webp', width = 1280) {
    const job = await this.imageQ.add('image', { inputUrl, outputKey, format, width }, { attempts: 3, removeOnComplete: true });
    return { id: job.id, name: job.name };
  }
}
