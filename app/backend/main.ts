import { LoggingInterceptor } from './src/logging.interceptor';

import rateLimit from 'express-rate-limit';
import { applySecurity } from './src/security/applySecurity';
import { mountMetricsEndpoint } from './src/observability/metrics';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import compression from 'compression';
import helmet from "helmet";
import { register as promRegister } from "prom-client";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(compression());

  try {
    const obs = await import('@arman/observability');
    if (obs && typeof (obs as any).setupObservability === 'function') {
      await (obs as any).setupObservability(app);
    }
  } catch (_) {}

  import * as bodyParser from 'body-parser';
import { bootstrapSecurityAndObservability } from '@arman/nest-bootstrap'
app.use(bodyParser.json({ verify: (req: any, res, buf) => { req.rawBody = buf; } }));
applySecurity(app);
mountMetricsEndpoint(app);
  await bootstrapSecurityAndObservability(app, 'backend')

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','x-request-id'],
    exposedHeaders: ['x-request-id']
  });

  
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_MAX || '120', 10),
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);

  
  // Basic health endpoints if not present at gateway level
  const http = app.getHttpAdapter();
  http.get('/healthz', (req, res) => res.status(200).send('OK'));
  http.get('/readyz', (req, res) => res.status(200).send('READY'));

    app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();