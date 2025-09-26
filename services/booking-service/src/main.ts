import 'reflect-metadata';
import '@arman/observability-sdk/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import { buildSecurityMiddleware, buildJwtVerifier, buildUserAwareRateLimit } from '@arman/security-middleware';

async function bootstrap(){
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const port = process.env.PORT || 4069;
  const sec = buildSecurityMiddleware();
  app.use(compression());
  app.use(sec.cors);
  app.use(sec.helmet);
  app.use(sec.hpp);
  app.use(buildJwtVerifier());
  app.use(buildUserAwareRateLimit());

  // background cleanup: expire holds and pending payments
  setInterval(()=>{
    // lazy import to avoid prisma on cold start
    import('./booking.service').then(({ BookingService })=>{
      const svc = new BookingService();
      svc.expireStale().catch(()=>{});
    });
  }, 60_000); // every 60s

  await app.listen(port);
  console.log('[booking-service] listening on '+port);
}
bootstrap();
