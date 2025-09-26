
import { ValidationPipe } from '@nestjs/common';
import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware } from '@arman/security-middleware';
import { applyBasicHardening } from '@arman/security-middleware';
import '@arman/observability-sdk/register';
import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './
import { bootstrapSecurityAndObservability } from '@arman/nest-bootstrap'
import { register as promRegister } from "prom-client";
import compression from "compression";
  app.enableCors({ origin: true, credentials: true }); // AUTO (Stage09)
app.module'
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

  // Phase1 Security: Helmet & CORS & RateLimit
  const allowed = (process.env.ALLOWED_ORIGINS||'').split(',').filter(Boolean);
  try { const helmet = (await import('helmet')).default; app.use(helmet()); } catch(e) {}
  app.enableCors({ origin: (origin, cb)=> { if(!origin || allowed.includes(origin)) return cb(null, true); return cb(new Error('CORS'), false); }, credentials:true });
  try { const rateLimit = (await import('express-rate-limit')).default; app.use(rateLimit({ windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS||'60000'), max: parseInt(process.env.RATE_LIMIT_MAX||'100') })); } catch(e) {}
app && app.use(buildJwtVerifier());
app && app.use(buildUserAwareRateLimit());
process.env.CSP_NONCE_MODE==='1' && app.use(cspMiddleware({mode:'nonce'}));


app && applyBasicHardening(app);
  app.setGlobalPrefix('analytics')
  

// AUTO (Stage14): basic health/ready endpoints (no deps)
const http = app.getHttpAdapter().getInstance();
if (http && typeof http.get === 'function') {
  if (!http._auto_healthz) {
    http.get('/healthz', (req, res) => res.status(200).json({ ok: true }));
    http.get('/readyz', (req, res) => res.status(200).json({ ready: true }));
    http._auto_healthz = true;
  }
}

  await bootstrapSecurityAndObservability(app, 'analytics-service')

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  }));

  await app.listen(process.env.PORT || 3000)
}
bootstrap()