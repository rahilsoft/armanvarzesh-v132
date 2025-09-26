import { Queue, QueueEvents, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { z } from 'zod';

const Env = z.object({
  REDIS_URL: z.string().url().optional(),
});

export type QueueContext = {
  queue: Queue | null;
  events: QueueEvents | null;
  worker?: Worker;
  ready: boolean;
};

export function createQueueContext(name: string, env: NodeJS.ProcessEnv = process.env): QueueContext {
  const parsed = Env.safeParse(env);
  if (!parsed.success || !parsed.data.REDIS_URL) {
    return { queue: null, events: null, ready: false };
  }
  const conn = new IORedis(parsed.data.REDIS_URL);
  const queue = new Queue(name, { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, defaultJobOptions: { attempts: parseInt(process.env.BULLMQ_DEFAULT_ATTEMPTS||'5'), backoff: { type: 'exponential', delay: parseInt(process.env.BULLMQ_BACKOFF_MS||'5000') }, removeOnComplete: parseInt(process.env.BULLMQ_REMOVE_ON_COMPLETE||'1000'), removeOnFail: parseInt(process.env.BULLMQ_REMOVE_ON_FAIL||'5000') },  connection: conn });
  const events = new QueueEvents(name, { connection: conn });
  return { queue, events, ready: true };
}

export async function addTestJob(ctx: QueueContext, payload: any) {
  if (!ctx.queue) throw new Error('Queue not ready');
  return ctx.queue.add('test', payload, { removeOnComplete: 100, attempts: 2 });
}


import client from 'prom-client';
const jobCompleted = new client.Counter({ name: 'queue_job_completed_total', help: 'Completed jobs', labelNames: ['queue'] });
const jobFailed = new client.Counter({ name: 'queue_job_failed_total', help: 'Failed jobs', labelNames: ['queue'] });

export function attachWorkerMetrics(ctx: QueueContext, handler?: (job: Job) => Promise<any>) {
  if (!ctx.queue || ctx.worker) return;
  ctx.worker = new Worker(ctx.queue.name, async (job, { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, concurrency: parseInt(process.env.WORKER_CONCURRENCY||'4') }) => {
    const start = Date.now();
    try {
      const res = handler ? await handler(job) : null;
      jobCompleted.labels(ctx.queue!.name).inc();
      return res;
    } catch (e) {
      jobFailed.labels(ctx.queue!.name).inc();
      throw e;
    } finally {
      // could add histogram for duration here
    }
  }, { connection: (ctx.queue as any).opts.connection });
}
