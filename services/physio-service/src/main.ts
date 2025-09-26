import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import { buildSecurityMiddleware, buildJwtVerifier, buildUserAwareRateLimit } from '@arman/security-middleware';
import { registerObservability } from '@arman/observability-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const port = process.env.PORT || 4061;

  // Security
  const sec = buildSecurityMiddleware();
  app.use(compression());
  app.use(sec.cors);
  app.use(sec.helmet);
  app.use(sec.hpp);
  app.use(buildJwtVerifier());
  app.use(buildUserAwareRateLimit());

  registerObservability(app);

  await app.listen(port as number);
  // eslint-disable-next-line no-console
  console.log(`[physio] listening on ${port}`);
}
bootstrap();
