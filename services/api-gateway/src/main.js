
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
process.env.SERVICE_NAME = process.env.SERVICE_NAME || 'api-gateway';
if (process.env.OTEL_ENABLED === 'true') {
  try { require('../../packages/observability/otel-node/dist/register.js'); } catch (e) {}
}

import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from 'jsonwebtoken';
import { fetch } from 'undici';
import { WebSocketServer, WebSocket } from 'ws';

const app = Fastify({ logger: false });
await app.register(cors, { origin: true, credentials: true });

const CONTENT_URL = process.env.CONTENT_SERVICE_URL || 'http://content-service:3000/graphql';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function parseAuth(req){
  const h = req.headers||{};
  const b = (h['authorization']||'').toString();
  if (b.startsWith('Bearer ')){
    try{ const d = jwt.verify(b.slice(7), JWT_SECRET); return { userId: d.sub||d.userId, role: d.role||'user' }; }
    catch(e){ return null; }
  }
  return null;
}

app.post('/graphql', async (req, reply)=>{
  const who = parseAuth(req);
  if (!who) return reply.code(401).send({ errors:[{ message:'unauthorized' }] });
  const res = await fetch(CONTENT_URL, {
    method:'POST',
    headers: { 'Content-Type':'application/json', 'x-role': who.role, 'x-user-id': who.userId },
    body: JSON.stringify(req.body||{})
  });
  const j = await res.json();
  return j;
});

// WS proxy (thin): forward client → content-service WS (no auth hardening here for dev)
const wss = new WebSocketServer({ noServer: true });
const targetURL = (process.env.CONTENT_WS_URL || 'ws://content-service:3000/ws');

const server = app.server;
server.on('upgrade', (req, socket, head)=>{
  if (req.url && req.url.startsWith('/ws')){
    wss.handleUpgrade(req, socket, head, (ws)=>{
      const upstream = new WebSocket(targetURL);
      upstream.on('open', ()=>{
        ws.on('message', (m)=> upstream.readyState===WebSocket.OPEN && upstream.send(m));
        upstream.on('message', (m)=> ws.readyState===WebSocket.OPEN && ws.send(m));
      });
      upstream.on('close', ()=> ws.close());
      ws.on('close', ()=> upstream.close());
    });
  } else {
    socket.destroy();
  }
});

const port = process.env.PORT||8080;
app.listen({ port, host:'0.0.0.0' }).then(()=> console.log('api-gateway on', port));

// -- Phase 1 routes --
const NUTRITION_URL = process.env.NUTRITION_SERVICE_URL || 'http://nutrition-service:3000';
const PAYMENTS_URL = process.env.PAYMENTS_SERVICE_URL || 'http://payments-service:3000';
const CONTENT_API = process.env.CONTENT_API_URL || 'http://content-service:3000';

app.post('/v1/health/hydration', async (req, reply) => {
  const r = await fetch(NUTRITION_URL + '/v1/health/hydration', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' },
    body: JSON.stringify(req.body||{})
  });
  return reply.code(r.status).send(await r.json());
});
app.get('/v1/health/hydration', async (req, reply) => {
  const q = new URLSearchParams(req.query||{}).toString();
  const r = await fetch(NUTRITION_URL + '/v1/health/hydration' + (q?`?${q}`:''), {
    headers: { 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' }
  });
  return reply.code(r.status).send(await r.json());
});

app.get('/v1/plans', async (req, reply) => {
  const r = await fetch(PAYMENTS_URL + '/v1/plans', { headers: { 'authorization': req.headers['authorization']||'' }});
  return reply.code(r.status).send(await r.json().catch(()=>({})));
});
app.post('/v1/subscriptions', async (req, reply) => {
  const r = await fetch(PAYMENTS_URL + '/v1/subscriptions', { method:'POST', headers: { 'content-type': 'application/json', 'authorization': req.headers['authorization']||'' }, body: JSON.stringify(req.body||{}) });
  return reply.code(r.status).send(await r.json().catch(()=>({})));
});
app.post('/v1/subscriptions/restore', async (req, reply) => {
  const r = await fetch(PAYMENTS_URL + '/v1/subscriptions/restore', { method:'POST', headers: { 'content-type': 'application/json', 'authorization': req.headers['authorization']||'' }, body: JSON.stringify(req.body||{}) });
  return reply.code(r.status).send(await r.json().catch(()=>({})));
});

app.get('/v1/feed', async (req, reply) => {
  const q = new URLSearchParams(req.query||{}).toString();
  const r = await fetch(CONTENT_API + '/v1/feed' + (q?`?${q}`:''), { headers: { 'authorization': req.headers['authorization']||'' } });
  return reply.code(r.status).send(await r.json().catch(()=>({})));
});


// -- Phase 2 routes --
const HEALTH_URL = process.env.NUTRITION_SERVICE_URL || 'http://nutrition-service:3000';
const SOCIAL_URL = process.env.SOCIAL_SERVICE_URL || 'http://social-subgraph:3000';

app.post('/v1/habits', async (req, reply) => {
  const r = await fetch(HEALTH_URL + '/v1/habits', { method:'POST', headers: { 'content-type':'application/json', 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' }, body: JSON.stringify(req.body||{}) });
  return reply.code(r.status).send(await r.json());
});
app.post('/v1/habits/:id/log', async (req, reply) => {
  const r = await fetch(HEALTH_URL + `/v1/habits/${req.params.id}/log`, { method:'POST', headers: { 'content-type':'application/json', 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' }, body: JSON.stringify(req.body||{}) });
  return reply.code(r.status).send(await r.json());
});
app.get('/v1/habits/today', async (req, reply) => {
  const q = new URLSearchParams(req.query||{}).toString();
  const r = await fetch(HEALTH_URL + '/v1/habits/today' + (q?`?${q}`:''), { headers: { 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' } });
  return reply.code(r.status).send(await r.json());
});

app.post('/v1/wearables/ingest', async (req, reply) => {
  const r = await fetch(HEALTH_URL + '/v1/wearables/ingest', { method:'POST', headers: { 'content-type':'application/json', 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' }, body: JSON.stringify(req.body||{}) });
  return reply.code(r.status).send(await r.json());
});

app.get('/v1/social/compare', async (req, reply) => {
  const q = new URLSearchParams(req.query||{}).toString();
  const r = await fetch(SOCIAL_URL + '/v1/social/compare' + (q?`?${q}`:''), { headers: { 'authorization': req.headers['authorization']||'' } });
  return reply.code(r.status).send(await r.json().catch(()=>({})));
});


// -- Phase 3 routes --
const ACTIVITIES_URL = process.env.ACTIVITIES_SERVICE_URL || 'http://activities-service:3000';
const CHALLENGES_URL = process.env.CHALLENGES_SERVICE_URL || 'http://challenges-service:3000';

app.post('/v1/activities/sessions', async (req, reply) => {
  const r = await fetch(ACTIVITIES_URL + '/v1/activities/sessions', { method:'POST', headers: { 'content-type': 'application/json', 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' }, body: JSON.stringify(req.body||{}) });
  return reply.code(r.status).send(await r.json());
});
app.post('/v1/activities/:id/route', async (req, reply) => {
  const r = await fetch(ACTIVITIES_URL + `/v1/activities/${req.params.id}/route`, { method:'POST', headers: { 'content-type': 'application/json', 'authorization': req.headers['authorization']||'' }, body: JSON.stringify(req.body||{}) });
  return reply.code(r.status).send(await r.json());
});
app.get('/v1/activities/:id/summary', async (req, reply) => {
  const r = await fetch(ACTIVITIES_URL + `/v1/activities/${req.params.id}/summary`, { headers: { 'authorization': req.headers['authorization']||'' } });
  return reply.code(r.status).send(await r.json());
});

app.get('/v1/challenges', async (_req, reply) => {
  const r = await fetch(CHALLENGES_URL + '/v1/challenges');
  return reply.code(r.status).send(await r.json());
});
app.post('/v1/challenges/join', async (req, reply) => {
  const r = await fetch(CHALLENGES_URL + '/v1/challenges/join', { method:'POST', headers: { 'content-type':'application/json', 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' }, body: JSON.stringify(req.body||{}) });
  return reply.code(r.status).send(await r.json());
});
app.post('/v1/challenges/complete', async (req, reply) => {
  const r = await fetch(CHALLENGES_URL + '/v1/challenges/complete', { method:'POST', headers: { 'content-type':'application/json', 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' }, body: JSON.stringify(req.body||{}) });
  return reply.code(r.status).send(await r.json());
});


// -- Phase 4 routes --
const COURSES_URL = process.env.COURSES_SERVICE_URL || 'http://courses-service:3000';
const KPIS_URL = process.env.KPIS_SERVICE_URL || 'http://kpis-service:3000';
const AFFILIATE_URL = process.env.AFFILIATE_SERVICE_URL || 'http://affiliate-service:3000';

app.get('/v1/courses/:id/manifest', async (req, reply) => {
  const r = await fetch(COURSES_URL + `/v1/courses/${req.params.id}/manifest`, { headers: { 'authorization': req.headers['authorization']||'' } });
  return reply.code(r.status).send(await r.json());
});
app.post('/v1/courses/:id/license', async (req, reply) => {
  const r = await fetch(COURSES_URL + `/v1/courses/${req.params.id}/license`, { method:'POST', headers: { 'content-type': 'application/json', 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' }, body: JSON.stringify(req.body||{}) });
  return reply.code(r.status).send(await r.json());
});
app.get('/v1/certificates/:id/qr', async (req, reply) => {
  const r = await fetch(COURSES_URL + `/v1/certificates/${req.params.id}/qr`, { headers: { 'authorization': req.headers['authorization']||'' } });
  return reply.code(r.status).send(await r.json());
});
app.get('/v1/certificates/:id', async (req, reply) => {
  const r = await fetch(COURSES_URL + `/v1/certificates/${req.params.id}`, { headers: { 'authorization': req.headers['authorization']||'' } });
  return reply.code(r.status).send(await r.json());
});

app.get('/v1/coach/kpis', async (req, reply) => {
  const r = await fetch(KPIS_URL + '/v1/coach/kpis', { headers: { 'authorization': req.headers['authorization']||'', 'x-coach-id': req.headers['x-coach-id']||'' } });
  return reply.code(r.status).send(await r.json());
});

app.get('/v1/affiliate/me', async (req, reply) => {
  const r = await fetch(AFFILIATE_URL + '/v1/affiliate/me', { headers: { 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' } });
  return reply.code(r.status).send(await r.json());
});
app.get('/v1/affiliate/leaderboard', async (_req, reply) => {
  const r = await fetch(AFFILIATE_URL + '/v1/affiliate/leaderboard');
  return reply.code(r.status).send(await r.json());
});


// -- Phase 5 routes --
const INBOX_URL = process.env.INBOX_SERVICE_URL || 'http://inbox-service:3000';
const ASSESS_URL = process.env.ASSESSMENTS_SERVICE_URL || 'http://assessments-service:3000';
const REWARDS_URL = process.env.REWARDS_SERVICE_URL || 'http://rewards-service:3000';

app.get('/v1/inbox', async (req, reply) => {
  const q = new URLSearchParams(req.query||{}).toString();
  const r = await fetch(INBOX_URL + '/v1/inbox' + (q?`?${q}`:''), { headers: { 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' } });
  return reply.code(r.status).send(await r.json());
});
app.post('/v1/inbox/:id/read', async (req, reply) => {
  const r = await fetch(INBOX_URL + `/v1/inbox/${req.params.id}/read`, { method: 'POST', headers: { 'authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' } });
  return reply.code(r.status).send(await r.json());
});

app.get('/v1/assessments', async (_req, reply) => {
  const r = await fetch(ASSESS_URL + '/v1/assessments');
  return reply.code(r.status).send(await r.json());
});
app.get('/v1/rewards', async (_req, reply) => {
  const r = await fetch(REWARDS_URL + '/v1/rewards');
  return reply.code(r.status).send(await r.json());
});


// -- Phase 7 routes --
const MEDICAL_URL = process.env.MEDICAL_SERVICE_URL || 'http://medical-service:3000';

app.get('/v1/medical/tests', async (_req, reply) => {
  const r = await fetch(MEDICAL_URL + '/v1/medical/tests');
  return reply.code(r.status).send(await r.json());
});
app.get('/v1/medical/bundles', async (_req, reply) => {
  const r = await fetch(MEDICAL_URL + '/v1/medical/bundles');
  return reply.code(r.status).send(await r.json());
});
app.post('/v1/medical/book', async (req, reply) => {
  const r = await fetch(MEDICAL_URL + '/v1/medical/book', { method:'POST', headers: { 'content-type':'application/json','authorization': req.headers['authorization']||'', 'x-user-id': req.headers['x-user-id']||'' }, body: JSON.stringify(req.body||{}) });
  return reply.code(r.status).send(await r.json());
});


// --- Phase 9: JWKS-based JWT verification (preferred) + device-bind + circuit-breaker fetch ---
try {
  const { createLocalJWKSet } = require('jose/jwks/local');
  const { jwtVerify } = require('jose');
  const http = require('node:https');
  const http2 = require('node:http');

  const JWKS_URL = process.env.JWKS_URL || '';
  const REQUIRE_DEVICE_ID = (process.env.REQUIRE_DEVICE_ID||'false').toLowerCase()==='true';
  let jwksCache = null;
  async function getJWKS() {
    if (!JWKS_URL) return null;
    if (jwksCache && (Date.now() - jwksCache.ts) < 5*60*1000) return jwksCache.set;
    const client = JWKS_URL.startsWith('https') ? http : http2;
    const res = await new Promise((resolve,reject)=>{
      const req = client.get(JWKS_URL, r=>{
        let d=''; r.on('data',c=>d+=c); r.on('end',()=>resolve({status:r.statusCode, body:d}));
      }); req.on('error',reject);
    });
    if (res.status !== 200) throw new Error('jwks_fetch_failed');
    const json = JSON.parse(res.body);
    const set = createLocalJWKSet(json);
    jwksCache = { ts: Date.now(), set };
    return set;
  }

  app.addHook('onRequest', async (req, reply) => {
    if (!JWKS_URL && !process.env.JWT_SECRET) return; // no auth configured
    try {
      const auth = req.headers['authorization']||'';
      const token = (auth.startsWith('Bearer ') ? auth.slice(7) : null);
      if (!token) return reply.code(401).send({ error: 'unauthorized' });
      let payload;
      if (JWKS_URL) {
        const set = await getJWKS();
        const out = await jwtVerify(token, set);
        payload = out.payload;
      } else {
        const { createSecretKey } = require('crypto');
        const secret = createSecretKey(Buffer.from(process.env.JWT_SECRET||'', 'utf8'));
        payload = (await jwtVerify(token, secret)).payload;
      }
      if (REQUIRE_DEVICE_ID) {
        const did = payload.did || payload.deviceId || null;
        const hdrDid = req.headers['x-device-id'] || null;
        if (!did || !hdrDid || String(did) !== String(hdrDid)) {
          return reply.code(401).send({ error: 'device_mismatch' });
        }
      }
      req.user = payload;
    } catch (e) {
      return reply.code(401).send({ error: 'invalid_token' });
    }
  });

  // Circuit-breaker wrapper for fetch (basic): timeout + retries + half-open timer
  const originalFetch = global.fetch || require('node-fetch');
  let cbOpen = false;
  let cbNextTry = 0;
  const CB_WINDOW_MS = 15000;
  const CB_ERR_THRESH = 5;
  let cbErrs = 0;

  async function cbFetch(url, opts={}) {
    const now = Date.now();
    if (cbOpen && now < cbNextTry) {
      throw new Error('circuit_open');
    }
    const controller = new AbortController();
    const t = setTimeout(()=> controller.abort(), (opts.timeout || 5000));
    try {
      const res = await originalFetch(url, { ...opts, signal: controller.signal });
      clearTimeout(t);
      if (!res.ok && res.status >= 500) throw new Error('upstream_'+res.status);
      cbErrs = 0;
      return res;
    } catch (e) {
      clearTimeout(t);
      cbErrs += 1;
      if (cbErrs >= CB_ERR_THRESH) { cbOpen = true; cbNextTry = Date.now() + CB_WINDOW_MS; }
      if ((opts.retries||0) > 0) {
        return cbFetch(url, { ...opts, retries: (opts.retries-1) });
      }
      throw e;
    }
  }
  global.fetch = cbFetch;
} catch(e) {
  app.log && app.log.warn('Phase 9 JWKS/circuit not active: ' + (e?.message||e));
}


// PHASE12_STRICT_CSP: if STRICT_CSP=true, harden Helmet CSP (no 'unsafe-inline')
try {
  const strict = (process.env.STRICT_CSP||'false').toLowerCase()==='true';
  if (strict && app && app.addHook) {
    app.addHook('onReady', async ()=>{
      try{
        const helmet = require('@fastify/helmet');
        await app.register(helmet, {
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              imgSrc: ["'self'", "data:", "https:"],
              styleSrc: ["'self'"],
              scriptSrc: ["'self'"],
              connectSrc: ["'self'"]
            }
          }
        });
        console.log('Strict CSP enabled');
      } catch(e){}
    });
  }
} catch(e){}
