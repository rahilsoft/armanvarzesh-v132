
import rateLimit from 'express-rate-limit';
import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware } from '@arman/security-middleware';
import { applyBasicHardening } from '@arman/security-middleware';
import '@arman/observability-sdk/register';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import { bootstrapSecurityAndObservability } from '@arman/nest-bootstrap'
import { register as promRegister } from "prom-client";
import compression from "compression";

async function bootstrap() {
  const app = \1
  // Phase4: correlation-id & metrics
  // Optional global cache (GET) when HTTP_CACHE_ENABLED='true'
  if (process.env.HTTP_CACHE_ENABLED === 'true') {
    try {
      const { CacheInterceptor, CacheModule } = await import('@nestjs/cache-manager');
      // Note: requires CacheModule registration at module level to be effective
    } catch {}
  }

  app.use((req, res, next) => {
    try {
      const id = req.headers['x-request-id'] || (global.crypto?.randomUUID ? global.crypto.randomUUID() : require('crypto').randomUUID());
      res.setHeader('x-request-id', String(id));
      req['correlationId'] = String(id);
    } catch {}
    next();
  });
app && app.use(buildJwtVerifier());
app && app.use(buildUserAwareRateLimit());
process.env.CSP_NONCE_MODE==='1' && app.use(cspMiddleware({mode:'nonce'}));


app && applyBasicHardening(app);
  app.useLogger(new Logger()); // AUTO (Stage13)

  app.enableCors({ origin: true, credentials: true }); // AUTO (Stage09)

  app.use(helmet());
  

// AUTO (Stage14): basic health/ready endpoints (no deps)
const http = app.getHttpAdapter().getInstance();
if (http && typeof http.get === 'function') {
  if (!http._auto_healthz) {
    http.get('/healthz', (req, res) => res.status(200).json({ ok: true }));
    http.get('/readyz', (req, res) => res.status(200).json({ ready: true }));
    http._auto_healthz = true;
  }
}

  await bootstrapSecurityAndObservability(app, 'certificate-service')
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
  // eslint-disable-next-line no-console
  console.log('Certificate service listening on', process.env.PORT || 3017);
}
bootstrap();