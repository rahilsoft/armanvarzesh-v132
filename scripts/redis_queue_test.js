
const { Queue, Worker, QueueEvents } = require('bullmq');
const IORedis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new IORedis(REDIS_URL);

async function run() {
  const queueName = 'ci-demo-queue';
  const queue = new Queue(queueName, { connection });
  const events = new QueueEvents(queueName, { connection });
  const messages = [];

  const worker = new Worker(queueName, async job => {
    messages.push(`processed:${job.id}:${job.data.msg}`);
    return { ok: true };
  }, { connection });

  await new Promise(res => events.on('completed', () => res()));

  // enqueue
  await queue.add('demo', { msg: 'hello-armanfit' }, { removeOnComplete: true, removeOnFail: true });
  await new Promise(resolve => setTimeout(resolve, 750));

  await worker.close();
  await events.close();
  await queue.close();
  await connection.quit();

  console.log('[bullmq] queue test passed. messages=', messages);
}

run().catch(async e => {
  console.error('[bullmq] queue test failed', e);
  try { await connection.quit(); } catch {}
  process.exit(1);
});
