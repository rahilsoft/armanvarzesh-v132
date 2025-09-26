// Simple E2E for backends (NestJS/Express)
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import http from 'node:http'; import https from 'node:https'; import { URL } from 'node:url';
import { readFileSync } from 'node:fs'; import { join } from 'node:path';

const pkgPath = process.argv[2];
if(!pkgPath){ console.error("Usage: node scripts/e2e-backend.mjs <package-dir>"); process.exit(2); }
const PORT = Number(process.env.PORT ?? 3100);
const METRICS_PORT = Number(process.env.METRICS_PORT ?? 9464);
const TIMEOUT_MS = Number(process.env.E2E_TIMEOUT_MS ?? 90000);

function fetchRaw(u, {method='GET', headers={}, body=null}={}){
  return new Promise((resolve,reject)=>{
    const url = new URL(u); const mod = url.protocol==='https:'?https:http;
    const req = mod.request(url, {method, headers}, res=>{ let data=''; res.on('data',d=>data+=d); res.on('end',()=>resolve({status:res.statusCode||0, headers:res.headers, body:data})); });
    req.on('error', reject); if(body) req.write(body); req.end();
  });
}
async function waitFor(urls){
  const deadline = Date.now()+TIMEOUT_MS;
  while(Date.now()<deadline){
    for(const u of urls){
      try{ const r = await fetchRaw(u); if(r.status>0) return {url:u,res:r}; }catch{}
    }
    await delay(750);
  }
  throw new Error("Service not reachable");
}

async function run(){
  const j = JSON.parse(readFileSync(join(pkgPath,'package.json'),'utf8'));
  const scripts = j.scripts||{}; const cmd = scripts.start?'start':(scripts.dev?'dev':null);
  if(!cmd){ throw new Error('No start/dev script'); }
  const child = spawn('pnpm', ['-C', pkgPath, cmd], { stdio:['ignore','pipe','pipe'], env:{...process.env, PORT:String(PORT), METRICS_PORT:String(METRICS_PORT), NODE_ENV:'test'} });
  let alive=true; child.on('exit', c=>{alive=false; console.log('child exited', c)});
  child.stdout.on('data', d=>process.stdout.write(String(d).slice(0,400)));
  child.stderr.on('data', d=>process.stderr.write(String(d).slice(0,400)));
  try{
    const {url} = await waitFor([`http://127.0.0.1:${PORT}/health`,`http://127.0.0.1:${PORT}/api/health`,`http://127.0.0.1:${PORT}/`]);
    const r1 = await fetchRaw(url); if(!(r1.status>=200 && r1.status<500)) throw new Error('health baseline');
    const r404 = await fetchRaw(`http://127.0.0.1:${PORT}/__definitely_404__`); if(r404.status!==404 && r404.status!==401 && r404.status!==403) throw new Error('404 behavior unexpected');
    const rM = await fetchRaw(`http://127.0.0.1:${METRICS_PORT}/metrics`); if(rM.status!==200) throw new Error('metrics missing');
    console.log("E2E OK for", pkgPath);
  } finally {
    if(alive){ child.kill('SIGTERM'); await delay(1000); child.kill('SIGKILL'); }
  }
}
run().catch(e=>{ console.error('E2E FAIL:', e?.message||e); process.exit(1); });
