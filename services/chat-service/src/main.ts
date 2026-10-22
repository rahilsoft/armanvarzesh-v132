import 'reflect-metadata';
import '@arman/observability-sdk/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import { buildSecurityMiddleware, buildJwtVerifier, buildUserAwareRateLimit } from '@arman/security-middleware';

async function bootstrap(){
  // rawBody lets the scan-result webhook verify its HMAC over the exact bytes
  // received; re-serializing the parsed body would not reproduce the digest.
  const app = await NestFactory.create(AppModule, { bufferLogs: true, rawBody: true });
  const port = process.env.PORT || 4077;
  const sec = buildSecurityMiddleware();
  app.use(compression());
  app.use(sec.cors);
  app.use(sec.helmet);
  app.use(sec.hpp);
  app.use(buildJwtVerifier());
  app.use(buildUserAwareRateLimit());
  await app.listen(port);
  console.log('[chat-service] listening on '+port);
}
bootstrap();
