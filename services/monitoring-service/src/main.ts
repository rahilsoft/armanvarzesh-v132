
import rateLimit from 'express-rate-limit';
import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware } from '@arman/security-middleware';
import { applyBasicHardening } from '@arman/security-middleware';
import '@arman/observability-sdk/register';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupObservability } from '@arman/observability';
import { AllExceptionsFilter, LoggingInterceptor, TransformInterceptor } from '@arman/shared';
import compression from 'compression';
import helmet from 'helmet';
import { initTracing } from '@arman/observability';
import { Logger } from '@nestjs/common';
initTracing();
// Prometheus metrics
import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller()
class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return register.metrics();
  }
}
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrapSecurityAndObservability } from '@arman/nest-bootstrap'

async function bootstrap() {
  const globalPrefix = process.env.API_PREFIX || '';
  await startTracing();
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

  
  if (process.env.ENABLE_OTEL === 'true') { try { setupObservability(); } catch (e) { console.error('OTEL init failed', e); } }
const swaggerCfg = new DocumentBuilder().setTitle('ArmanFit').setDescription('API').setVersion('1.0').addBearerAuth().build();
  const doc = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup('docs', app, doc);
  if (process.env.API_PREFIX) app.setGlobalPrefix(process.env.API_PREFIX);
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(compression());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: (origin, cb) => {
    const list = (process.env.CORS_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);
    if (!origin || list.length===0 || list.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  }, credentials: true });
  const port = process.env.PORT || 3016;
  await 

// AUTO (Stage14): basic health/ready endpoints (no deps)
const http = app.getHttpAdapter().getInstance();
if (http && typeof http.get === 'function') {
  if (!http._auto_healthz) {
    http.get('/healthz', (req, res) => res.status(200).json({ ok: true }));
    http.get('/readyz', (req, res) => res.status(200).json({ ready: true }));
    http._auto_healthz = true;
  }
}

  await bootstrapSecurityAndObservability(app, 'monitoring-service')

  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_MAX || '120', 10),
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000, '0.0.0.0');
  console.log(`Monitoring service running on port ${port}`);
}

bootstrap();