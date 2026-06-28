/* Stage 12 Worker Skeleton (BullMQ)
 * Job: resize
 * This file is NOT imported by default. Wire it in a Module to enable.
*/
import { Worker, QueueEvents } from 'bullmq';
const connection = { url: process.env.REDIS_URL || 'redis://localhost:6379' };
export const worker_resize = new Worker('resize', async (_job) => {
  // TODO: implement handler
}, { connection, concurrency: parseInt(process.env.WORKER_CONCURRENCY || '4') });
export const qe_resize = new QueueEvents('resize', { connection });
