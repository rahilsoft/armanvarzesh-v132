import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware } from '@arman/security-middleware';
import { applyBasicHardening } from '@arman/security-middleware';
import '@arman/observability-sdk/register';
import compression from "compression";

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { bootstrapSecurityAndObservability } from '@arman/nest-bootstrap'

const server = createServer();
const wss = new WebSocketServer({ server });

// simple channel hub
const channels = new Map(); // threadId -> Set<ws>

export function wsBroadcast(threadId: string, payload: any){
  const set = channels.get(threadId); if (!set) return;
  const data = JSON.stringify({ type:'message', threadId, payload });
  for (const ws of set){ try{ ws.send(data); }catch(e){} }
}

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
  await bootstrapSecurityAndObservability(app, 'content-service')
  app.useLogger(new Logger()); // AUTO (Stage13)

  app.enableCors({ origin: true, credentials: true }); // AUTO (Stage09)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  try {
    const prom = await import('prom-client');
    prom.register.setDefaultLabels({ app: 'armanvarzesh' });
    prom.collectDefaultMetrics();
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.get('/metrics', async (_req, res) => {
      res.set('Content-Type', prom.register.contentType);
      res.end(await prom.register.metrics());
    });
  } catch {}

    try { app.getHttpAdapter().getInstance().set('etag','strong'); } catch(e) {}
await app.init();
  const nestServer = app.getHttpAdapter().getInstance();
  server.on('request', nestServer);
  wss.on('connection', (ws, req)=>{
    ws.on('message', (buff)=>{
      try{
        const msg = JSON.parse(buff.toString());
        if (msg.type==='subscribe' && msg.threadId){
          let set = channels.get(msg.threadId); if (!set){ set = new Set(); channels.set(msg.threadId, set); }
          set.add(ws);
          ws.send(JSON.stringify({ type:'subscribed', threadId: msg.threadId }));
        }
      }catch(e){}
    });
    ws.on('close', ()=>{
      for (const [k, set] of channels){ set.delete(ws); if (set.size===0) channels.delete(k); }
    });
  });
  const port = process.env.PORT || 3000;
  server.listen(port, ()=> console.log('content-service + ws on', port));
}
bootstrap();


const prismaCron = new PrismaClient();
// Run at 02:00 every day (server local time)
cron.schedule('0 2 * * *', async ()=>{
  try{
    console.log('[cron] daily surveys + score recompute');
    // generate survey tasks
    // simple direct call via prisma/logic
    const since = new Date(Date.now() - 1000*60*60*24*16);
    const leads = await prismaCron.lead.findMany({ where:{ createdAt:{ gte: since } } });
    const tmpl = await prismaCron.surveyTemplate.findFirst({ where:{ code:'BIWEEKLY', active:true } });
    if (tmpl){
      for (const l of leads){
        const existing = await prismaCron.surveyTask.findFirst({ where:{ userId:l.userId, specialistId:l.specialistId, templateCode:'BIWEEKLY', completedAt: null } });
        if (!existing){
          await prismaCron.surveyTask.create({ data:{ userId:l.userId, specialistId:l.specialistId, serviceType:l.serviceType, templateCode:'BIWEEKLY', dueAt: new Date(Date.now()+1000*60*60*24*14) } });
        }
      }
    }
    // nightly recompute demo: recompute top 50 specialists per role
    const roles = ['COACH','NUTRITION','CORRECTIVE'] as const;
    for (const r of roles){
      const specs = await prismaCron.specialistScore.findMany({ where:{ role: r as any }, orderBy:{ lastComputed: 'asc' }, take: 50 });
      for (const s of specs){
        // placeholder; actual compute is in ScoringService — would require DI
        await prismaCron.specialistScore.update({ where:{ specialistId: s.specialistId }, data:{ lastComputed: new Date() } });
      }
    }
  }catch(e){ console.error('[cron] error', e); }
});


// AUTO (Stage14): basic health/ready endpoints (no deps)
const http = app.getHttpAdapter().getInstance();
if (http && typeof http.get === 'function') {
  if (!http._auto_healthz) {
    http.get('/healthz', (req, res) => res.status(200).json({ ok: true }));
    http.get('/readyz', (req, res) => res.status(200).json({ ready: true }));
    http._auto_healthz = true;
  }
}