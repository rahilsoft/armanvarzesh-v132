
import rateLimit from 'express-rate-limit';
import { TraceEnrichInterceptor } from './observability/trace-enrich.interceptor';
import { initTracing } from './observability/tracing';
import { initMetrics, metricsMiddleware, metricsHandler } from './observability/metrics';
import { JsonLogger } from './observability/logger';
import { DoubleConfirmGuard } from './common/double-confirm.guard';
import { AuditInterceptor } from './common/audit.interceptor';
import { RolesGuard } from './common/roles.guard';
import { mountStripeWebhook } from './payments/stripe-webhook';
import { paymentsRateLimiter } from './payments/rate-limit';
import { RedactLoggingInterceptor } from './common/redact-logging.interceptor';
import { correlationMiddleware } from './common/correlation.middleware';
import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware } from '@arman/security-middleware';
import { applyBasicHardening } from '@arman/security-middleware';
import '@arman/observability-sdk/register';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { NestFactory } from '@nestjs/core';
import { validateEnv } from '@arman/env-config';
import helmet from 'helmet';
import { initTelemetry } from '@arman/observability';
import { AppModule } from './app.module';
import { register as promRegister } from "prom-client";
// removed duplicate helmet import
import compression from 'compression';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
// duplicate import removed
// import { GlobalExceptionFilter } from './common/filters/global-exception.filter'; // optional

async function bootstrap() {
  // Initialize tracing and metrics
  await initTracing();
  initMetrics();

  // Create Nest app and use pino logger
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  // Initialize custom telemetry (backwards compatibility)
  await initTelemetry();

  const env = validateEnv(process.env);
  await initTelemetry('backend');

  // Security middlewares
  // Enable default Helmet protection. Removing the disabled contentSecurityPolicy restores a strong CSP.
  app.use(helmet());
  // Apply additional CSP directives via security-middleware to disallow unsafe inline scripts.
  app.use(cspMiddleware());
  app.use(compression());

  // Metrics endpoint and middleware
  app.use(metricsMiddleware);
  const http = app.getHttpAdapter().getInstance();
  if (http && typeof http.get === 'function') {
    http.get('/metrics', metricsHandler);
  }

  if (env.PORT) { /* bound later */ }

  // Duplicate helmet/compression removed above

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS (read from env, with logging if blocked)
  app.enableCors({
    origin: (origin, cb) => {
      const list = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (!origin || list.length === 0 || list.includes(origin)) return cb(null, true);
      const warn = new Logger('CORS');
      warn.warn(`Blocked origin: ${origin}`);
      return cb(new Error('CORS blocked'));
    },
    credentials: true,
  });

  app.enableVersioning({ type: VersioningType.URI });
  app.enableShutdownHooks();

  // app.useGlobalFilters(new GlobalExceptionFilter());

  const port = Number(process.env.PORT || 3000);
  

// AUTO (Stage14): basic health/ready endpoints (no deps)
if (http && typeof http.get === 'function') {
  if (!http._auto_healthz) {
    http.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));
    http.get('/readyz', (_req, res) => res.status(200).json({ ready: true }));
    http._auto_healthz = true;
  }
}

  app.set("etag", "strong");
  app.use((req, res, next) => { if (req.method === "GET") { res.setHeader("Cache-Control", process.env.DEFAULT_CACHE || "public, max-age=60, stale-while-revalidate=300"); } next(); });

  
  // Replace basic rate limiter with a user‑aware, distributed limiter from @arman/security-middleware.
  // This middleware uses Redis when available and includes per‑user limits rather than a global in‑memory limit.
  app.use(buildUserAwareRateLimit());

  await app.listen(port, '0.0.0.0');
  app.get(Logger).log(`Backend up on :${port}`);
}
bootstrap();