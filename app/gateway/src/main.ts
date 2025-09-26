import 'reflect-metadata';
import '@arman/observability-sdk/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import { json, urlencoded } from 'express';
import { waf } from './waf';
import { buildSecurityMiddleware, buildCors } from '@arman/security-middleware';

async function bootstrap(){
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const port = process.env.PORT || 4089;

  // Security & limits
  const cors = buildCors({ origins: ['*'] });
  app.use(cors);
  app.use(compression());
  app.use(waf({ maxBodyBytes: (process.env.BODY_LIMIT_BYTES? Number(process.env.BODY_LIMIT_BYTES): undefined), allowOrigins: (process.env.ALLOW_ORIGINS||'').split(',').filter(Boolean) }));
  app.use(json({ limit: process.env.BODY_LIMIT || '1mb' }));
  app.use(urlencoded({ extended: true, limit: process.env.BODY_LIMIT || '1mb' }));

  await app.listen(port as number);
  console.log('[gateway] listening on '+port);
}
bootstrap();
