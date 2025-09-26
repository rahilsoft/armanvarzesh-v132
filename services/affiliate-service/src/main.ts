
import rateLimit from 'express-rate-limit';

import { ValidationPipe } from '@nestjs/common';

// PHASE12_LOG_CORR: append trace_id to console logs if present
const _origLog = console.log;
console.log = (...args)=>{
  try {
    const tid = (global._traceparent || process.env.TRACE_ID || '').toString();
    if (tid) _origLog(JSON.stringify({ type:'log', trace_id: tid, msg: args }));
    else _origLog(...args);
  } catch(e){ _origLog(...args); }
};

// OTEL_INIT_PHASE11
process.env.SERVICE_NAME = process.env.SERVICE_NAME || 'affiliate-service';
if (process.env.OTEL_ENABLED === 'true') {
  try { require('../../packages/observability/otel-node/dist/register.js'); } catch (e) {}
}

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import helmet from 'helmet';
import * as client from 'prom-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log','error','warn'] });
  app.use(helmet());
  app.use(compression());

  const register = new client.Registry();
  client.collectDefaultMetrics({ register });

  const http = app.getHttpAdapter().getInstance();
  if (http && typeof http.get === 'function') {
    if (!http._auto_healthz) {
      http.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));
      http.get('/readyz', (_req, res) => res.status(200).json({ ready: true }));
      http._auto_healthz = true;
    }
  }

  const port = process.env.PORT || 3000;
  
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','x-request-id'],
    exposedHeaders: ['x-request-id']
  });

  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  }));

  
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_MAX || '120', 10),
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);

  await app.listen(port, '0.0.0.0');
  console.log(`affiliate-service listening on ${port}`);
}
bootstrap();
