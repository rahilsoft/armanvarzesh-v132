
import rateLimit from 'express-rate-limit';
import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware } from '@arman/security-middleware';
import { applyBasicHardening } from '@arman/security-middleware';
import '@arman/observability-sdk/register';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { AllExceptionsFilter, LoggingInterceptor, TransformInterceptor } from '@arman/shared';
import { initTracing } from '@arman/observability';
import { Logger } from '@nestjs/common';
import { bootstrapSecurityAndObservability } from '@arman/nest-bootstrap'
import { register as promRegister } from "prom-client";
initTracing();
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

  app.use(helmet());
  app.use(compression());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());
  if (process.env.API_PREFIX) app.setGlobalPrefix(process.env.API_PREFIX);

  const config = new DocumentBuilder().setTitle('workouts-service').setVersion('1.0').addBearerAuth().build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, doc);

  

// AUTO (Stage14): basic health/ready endpoints (no deps)
const http = app.getHttpAdapter().getInstance();
if (http && typeof http.get === 'function') {
  if (!http._auto_healthz) {
    http.get('/healthz', (req, res) => res.status(200).json({ ok: true }));
    http.get('/readyz', (req, res) => res.status(200).json({ ready: true }));
    http._auto_healthz = true;
  }
}

  await bootstrapSecurityAndObservability(app, 'workouts-service')

  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_MAX || '120', 10),
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log('workouts-service running on port', process.env.PORT || 3000);
}
bootstrap();