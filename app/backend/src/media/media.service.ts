const mediaJobs = new client.Counter({ name: 'media_jobs_total', help: 'Media jobs enqueued', labelNames: ['type'] });
import client from 'prom-client';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MediaService {
  private queue: Queue;
  constructor() {
    const { Queue } = require('bullmq');
    this.queue = new Queue('media', { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, defaultJobOptions: { attempts: parseInt(process.env.BULLMQ_DEFAULT_ATTEMPTS||'5'), backoff: { type: 'exponential', delay: parseInt(process.env.BULLMQ_BACKOFF_MS||'5000') }, removeOnComplete: parseInt(process.env.BULLMQ_REMOVE_ON_COMPLETE||'1000'), removeOnFail: parseInt(process.env.BULLMQ_REMOVE_ON_FAIL||'5000') },  connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } });
  }
  async enqueueTranscode(key: string, kind: 'image'|'video') {
    if (kind === 'image') mediaJobs.inc({ type: 'resize' });
    return this.queue.add('resize', { key, width: 800 }, { attempts: 3 });
    if (kind === 'video') mediaJobs.inc({ type: 'transcode' });
    return this.queue.add('transcode', { key }, { attempts: 3 });
  }
}
