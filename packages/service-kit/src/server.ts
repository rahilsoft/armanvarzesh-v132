import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import pino from 'pino';
import client, { Registry, Histogram, Counter } from 'prom-client';
import rateLimit from 'express-rate-limit';
import { loadEnv } from './config';
import type { ServiceKit, ServiceKitOptions } from './types';

async function maybeSetupObservability() {
  try {
    // @ts-ignore
    const mod = await import('@arman/observability');
    if (mod && typeof mod.setupObservability === 'function') {
      await mod.setupObservability();
    }
  } catch {}
}

export async function createApp(opts: ServiceKitOptions): Promise<ServiceKit> {
  await maybeSetupObservability();
  const env = loadEnv({
    SERVICE_NAME: opts.serviceName,
    PORT: String(opts.port ?? process.env.PORT ?? 4000),
    LOG_LEVEL: opts.logLevel ?? process.env.LOG_LEVEL ?? 'info',
    CORS_ORIGINS: (opts.corsOrigins ?? []).join(',') || (process.env.CORS_ORIGINS ?? ''),
  });

  const app = express();
  const logger = pino({ level: env.LOG_LEVEL });

  // Strict Helmet config (CSP minimal for API)
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        upgradeInsecureRequests: []
      }
    },
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'no-referrer' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
  }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  if (opts.enableCors !== false) {
    app.use(cors({
      origin: (origin, cb) => {
        if (!origin || env.CORS_ORIGINS.length === 0 || env.CORS_ORIGINS.includes(origin)) return cb(null, true);
        logger.warn({ origin }, 'CORS blocked');
        return cb(new Error('CORS blocked'));
      },
      credentials: true
    }));
  }

  // Rate limit (per IP) - overridable via env
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
  const max = Number(process.env.RATE_LIMIT_MAX || 100);
  app.use(rateLimit({ windowMs, max, standardHeaders: true, legacyHeaders: false }));

  // Prometheus registry + HTTP metrics
  const registry = new Registry();
  client.collectDefaultMetrics({ register: registry, prefix: `${env.SERVICE_NAME}_` });

  const httpDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method','route','code','service'],
    buckets: [0.005,0.01,0.025,0.05,0.1,0.25,0.5,1,2,5]
  });
  const httpCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method','route','code','service']
  });
  registry.registerMetric(httpDuration);
  registry.registerMetric(httpCounter);

  // Audit logging + metrics middleware
  app.use((req, res, next) => {
    const start = process.hrtime.bigint();
    const method = req.method;
    const url = req.originalUrl || req.url;
    res.on('finish', () => {
      const end = process.hrtime.bigint();
      const dur = Number(end - start) / 1e9;
      const code = res.statusCode;
      const route = (req.route && req.route.path) || req.path || url;
      httpDuration.labels(method, route, String(code), env.SERVICE_NAME).observe(dur);
      httpCounter.labels(method, route, String(code), env.SERVICE_NAME).inc();
      logger.info({ method, route, code, dur }, 'http');
    });
    next();
  });

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
  app.get('/ready', (_req, res) => res.status(200).json({ ready: true }));
  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', registry.contentType);
    res.end(await registry.metrics());
  });
  app.get('/config', (_req, res) => res.json({ service: env.SERVICE_NAME, port: env.PORT, log: env.LOG_LEVEL }));

  const start = async (port?: number) => {
    const p = port ?? env.PORT;
    const server = app.listen(p, '0.0.0.0', () => logger.info(`${env.SERVICE_NAME} listening on :${p}`));
    const shutdown = (sig: string) => {
      logger.info({ sig }, 'shutdown signal received');
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10000).unref();
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    return server;
  };

  return { app, registry, logger, config: env, start };
}

export async function createHttpService(opts: ServiceKitOptions) {
  const ctx = await createApp(opts);
  await ctx.start();
  return ctx;
}
