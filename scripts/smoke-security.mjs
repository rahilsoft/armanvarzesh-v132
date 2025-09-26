// Security & Observability smoke for a single package
// Usage: node scripts/smoke-security.mjs packages/service-foo
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const pkgPath = process.argv[2];
if(!pkgPath){ console.error('Usage: node scripts/smoke-security.mjs <package-dir>'); process.exit(2); }

const BASE_PORT = Number(process.env.PORT ?? 3000);
const METRICS_PORT = Number(process.env.METRICS_PORT ?? 9464);
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS ?? 60000);
const RATE_MAX = Number(process.env.RATE_LIMIT_MAX ?? 5);
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 10000);

function fetchRaw(u, {method='GET', headers={}, body=null}={}){
  return new Promise((resolve,reject)=>{
    const url = new URL(u);
    const mod = url.protocol === 'https:' ? https : http;
    const req = mod.request(url, {method, headers}, res => {
      let data = '';
      res.on('data', d=> data += d);
      res.on('end', ()=> resolve({ status: res.statusCode||0, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if(body) req.write(body);
    req.end();
  });
}

async function waitFor(urls){
  const deadline = Date.now() + TIMEOUT_MS;
  while(Date.now() < deadline){
    for(const u of urls){
      try{
        const res = await fetchRaw(u);
        if(res.status>0){ return {url: u, res}; }
      }catch{}
    }
    await delay(750);
  }
  throw new Error('Service not reachable on: ' + urls.join(', '));
}

async function run(){
  const pkgJson = JSON.parse(readFileSync(join(pkgPath,'package.json'),'utf8'));
  const scripts = pkgJson.scripts || {};
  const cmd = scripts.start ? 'start' : (scripts.dev ? 'dev' : null);
  if(!cmd){ console.error('No start/dev script in package ' + pkgPath); process.exit(3); }

  const child = spawn('pnpm', ['-C', pkgPath, cmd], {
    stdio: ['ignore','pipe','pipe'],
    env: {
      ...process.env,
      PORT: String(BASE_PORT),
      METRICS_PORT: String(METRICS_PORT),
      METRICS_PATH: '/metrics',
      CORS_ORIGIN: '*',
      RATE_LIMIT_MAX: String(RATE_MAX),
      RATE_LIMIT_WINDOW_MS: String(WINDOW_MS),
      NODE_ENV: 'test'
    }
  });

  let alive = true;
  child.on('exit', (code)=>{ alive = false; console.log('child exited', code); });
  child.stdout.on('data', (d)=> process.stdout.write(String(d).slice(0,400)));
  child.stderr.on('data', (d)=> process.stderr.write(String(d).slice(0,400)));

  try{
    const baseUrls = [
      `http://127.0.0.1:${BASE_PORT}/`,
      `http://127.0.0.1:${BASE_PORT}/health`,
      `http://127.0.0.1:${BASE_PORT}/api/health`
    ];
    const {url: liveUrl} = await waitFor(baseUrls);

    const res1 = await fetchRaw(liveUrl);
    const headers = Object.fromEntries(Object.entries(res1.headers).map(([k,v])=>[k.toLowerCase(), v]));
    const required = ['x-dns-prefetch-control','x-content-type-options','x-download-options','x-frame-options','content-security-policy'];
    const missing = required.filter(h=> !(h in headers));
    if(missing.length){ throw new Error('Missing security headers: '+ missing.join(', ')); }

    let got429 = false;
    for(let i=0;i<RATE_MAX+5;i++){
      const r = await fetchRaw(liveUrl);
      if(r.status === 429){ got429 = true; break; }
      await delay(30);
    }
    if(!got429){ throw new Error('Rate-limit did not trigger (expect 429)'); }

    // Per-user/token rate limit bucket (optional): use a dummy bearer
    const AUTH_BEARER = 'Bearer dummy.token.value';
    let seen429User = false;
    for(let i=0;i<RATE_MAX+5;i++){
      const r = await fetchRaw(liveUrl, { headers: { authorization: AUTH_BEARER } });
      if(r.status === 429){ seen429User = true; break; }
      await delay(30);
    }
    if(!seen429User){
      throw new Error("User-aware rate-limit did not trigger (Authorization bucket).");
    }


    const metricsUrl = `http://127.0.0.1:${METRICS_PORT}/metrics`;
    const resM = await fetchRaw(metricsUrl);
    if(resM.status !== 200){ throw new Error('Metrics endpoint unhealthy: status='+resM.status); }

    console.log('SMOKE OK for', pkgPath);
  } finally {
    if(alive){
      child.kill('SIGTERM');
      await delay(1000);
      child.kill('SIGKILL');
    }
  }
}

run().catch(e=>{ console.error('SMOKE FAIL:', e?.message || e); process.exit(1); });