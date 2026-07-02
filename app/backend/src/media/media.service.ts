import client from 'prom-client';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

// Must come after the prom-client import: this statement previously sat above
// it, which crashes at module load in the compiled CJS output.
const mediaJobs = new client.Counter({ name: 'media_jobs_total', help: 'Media jobs enqueued', labelNames: ['type'] });

@Injectable()
export class MediaService {
  private queue: Queue;
  constructor() {
    this.queue = new Queue('media', { defaultJobOptions: { attempts: parseInt(process.env.BULLMQ_DEFAULT_ATTEMPTS||'5'), backoff: { type: 'exponential', delay: parseInt(process.env.BULLMQ_BACKOFF_MS||'5000') }, removeOnComplete: parseInt(process.env.BULLMQ_REMOVE_ON_COMPLETE||'1000'), removeOnFail: parseInt(process.env.BULLMQ_REMOVE_ON_FAIL||'5000') },  connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } });
  }
  async enqueueTranscode(key: string, kind: 'image'|'video') {
    // Previously the image path returned unconditionally, making the video
    // branch unreachable — every video was enqueued as a resize job.
    if (kind === 'image') {
      mediaJobs.inc({ type: 'resize' });
      return this.queue.add('resize', { key, width: 800 }, { attempts: 3 });
    }
    mediaJobs.inc({ type: 'transcode' });
    return this.queue.add('transcode', { key }, { attempts: 3 });
  }
}
