import { createApp } from '@arman/service-kit';
import pkg from '../package.json';

const serviceName = 'payments-service';

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
