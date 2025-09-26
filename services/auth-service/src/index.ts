import { createApp } from '@arman/service-kit';
import pkg from '../package.json' assert { type: 'json' };

const serviceName = 'auth-service';

async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

  // example endpoint
  ctx.app.get('/info', (_req, res) => res.json({
    service: serviceName,
    version: pkg.version,
    time: new Date().toISOString()
  }));

  await ctx.start();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { createDbContext, dbPing, createQueueContext } from '@arman/integration';

// Optional integrations (enabled if envs set)
const dbCtx = createDbContext(process.env);
const qCtx = createQueueContext('auth-service', process.env);

ctx.app.get('/diag', async (_req, res) => {
  const dbOk = await dbPing(dbCtx);
  const queueOk = qCtx.ready;
  res.json({ db: dbOk, queue: queueOk });
});
