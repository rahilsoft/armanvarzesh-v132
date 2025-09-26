import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware } from '@arman/security-middleware';
import { applyBasicHardening } from '@arman/security-middleware';
import '@arman/observability-sdk/register';

import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { z } from 'zod';
import { createClient } from '@clickhouse/client';

const log = pino({ level: process.env.LOG_LEVEL || 'info' });
const app = express();
app && app.use(buildJwtVerifier());
app && app.use(buildUserAwareRateLimit());
process.env.CSP_NONCE_MODE==='1' && app.use(cspMiddleware({mode:'nonce'}));


app && applyBasicHardening(app);
app.use(express.json({ limit: '1mb' }));

// CORS
const origins = (process.env.CORS_ORIGINS || '*').split(',').map(s=>s.trim());
app.use(cors({ origin: (origin, cb)=> cb(null, origins.includes('*') || !origin || origins.includes(origin)) }));

// ClickHouse client
const ch = createClient({
  url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
});

const table = process.env.CLICKHOUSE_TABLE || 'events';
const database = process.env.CLICKHOUSE_DATABASE || 'default';

const EventSchema = z.object({
  name: z.string(),
  ts: z.number().or(z.string()).transform(v=> Number(v)),
  uid: z.string().optional(),
  session: z.string().optional(),
  payload: z.record(z.any()).optional(),
  ua: z.string().optional(),
  ip: z.string().optional()
});

const BodySchema = z.object({
  app: z.string().default('vitrin-site'),
  events: z.array(EventSchema)
});

app.post('/v1/events', async (req, res)=>{
  try{
    const parsed = BodySchema.parse(req.body);
    const rows = parsed.events.map(e=> ({
      app: parsed.app,
      name: e.name,
      ts: new Date(e.ts),
      uid: e.uid || null,
      session: e.session || null,
      ua: e.ua || req.headers['user-agent'] || null,
      ip: e.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
      payload: JSON.stringify(e.payload || {})
    }));

    await ch.insert({
      table: `${database}.${table}`,
      values: rows,
      format: 'JSONEachRow'
    });

    res.json({ ok: true, inserted: rows.length });
  }catch(err:any){
    log.error({ err }, 'insert error');
    res.status(400).json({ ok:false, error: err?.message || 'bad_request' });
  }
});

app.get('/healthz', (_req, res)=> res.send('ok'));

const port = Number(process.env.PORT || 8088);
app.listen(port, ()=> log.info(`analytics-collector listening on ${port}`));
