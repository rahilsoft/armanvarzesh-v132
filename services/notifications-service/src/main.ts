import 'reflect-metadata';
import '@arman/observability-sdk/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import { buildSecurityMiddleware, buildJwtVerifier, buildUserAwareRateLimit } from '@arman/security-middleware';

async function bootstrap(){
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const port = process.env.PORT || 4079;
  const sec = buildSecurityMiddleware();
  app.use(compression());
  app.use(sec.cors);
  app.use(sec.helmet);
  app.use(sec.hpp);
  app.use(buildJwtVerifier());
  app.use(buildUserAwareRateLimit());

  // simple in-proc scheduler
  setInterval(()=>{
    import('./notifications.service').then(async ({ NotificationsService })=>{
      const s = new NotificationsService();
      await s.processDue().catch(()=>{});
    });
  }, 30_000);

  await app.listen(port);
  console.log('[notifications-service] listening on '+port);
}
bootstrap();
