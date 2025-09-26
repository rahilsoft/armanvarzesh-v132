/* Stage 12 Worker Skeleton (BullMQ)
 * Job: transcode
 * This file is NOT imported by default. Wire it in a Module to enable.
*/
import { Worker, QueueEvents } from 'bullmq';
const connection = { url: process.env.REDIS_URL || 'redis://localhost:6379' };
export const worker_transcode = new Worker('transcode', async (job, { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, concurrency: parseInt(process.env.WORKER_CONCURRENCY||'4') })=> {
  // TODO: implement handler
}, { connection });
export const qe_transcode = new QueueEvents('transcode', { connection });
