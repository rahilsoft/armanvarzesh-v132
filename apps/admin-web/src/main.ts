
import rateLimit from 'express-rate-limit';
import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware } from '@arman/security-middleware';
import { applyBasicHardening } from '@arman/security-middleware';
import '@arman/observability-sdk/register';
import { Logger } from '@nestjs/common';
import { bootstrapSecurityAndObservability } from '@arman/nest-bootstrap'
import helmet from "helmet";
import { register as promRegister } from "prom-client";
import compression from "compression";
/* Minimal Nest/Node entrypoint */
async function bootstrap() {
  // If Nest is present, try dynamic import; otherwise, provide a no-op.
  try {
    const { NestFactory } = await import('@nestjs/core');
    const { AppModule } = await import('./app.module');
    const app = await NestFactory.create(AppModule, { logger: false });
  app.use(compression());
  app.use(helmet());
app && app.use(buildJwtVerifier());
app && app.use(buildUserAwareRateLimit());
process.env.CSP_NONCE_MODE==='1' && app.use(cspMiddleware({mode:'nonce'}));


app && applyBasicHardening(app);
  app.useLogger(new Logger()); // AUTO (Stage13)

  app.enableCors({ origin: true, credentials: true }); // AUTO (Stage09)

    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    

// AUTO (Stage14): basic health/ready endpoints (no deps)
const http = app.getHttpAdapter().getInstance();
if (http && typeof http.get === 'function') {
  if (!http._auto_healthz) {
    http.get('/healthz', (req, res) => res.status(200).json({ ok: true }));
    http.get('/readyz', (req, res) => res.status(200).json({ ready: true }));
    http._auto_healthz = true;
  }
}

  await bootstrapSecurityAndObservability(app, 'armanfit-admin')
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  // Metrics endpoint
  const httpAdapter = app.getHttpAdapter();
  const server = httpAdapter.getInstance();
  server.get("/metrics", async (_req, res) => {
    res.setHeader("Content-Type", promRegister.contentType);
    res.end(await promRegister.metrics());
  });

  // Health endpoint
  server.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
  });

  \1
    console.log(`Service started at http://localhost:${port}`);
  } catch (e) {
    // Fallback: simple node script
    console.log('Service bootstrap (non-Nest fallback). Set up Nest AppModule to enable HTTP server.');
  }
}
bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});