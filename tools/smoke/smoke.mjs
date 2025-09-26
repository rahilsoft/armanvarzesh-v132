// tools/smoke/smoke.mjs
import fetch from 'node-fetch';

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

async function check(url){
  const t0 = Date.now();
  try{
    const res = await fetch(url);
    const ms = Date.now()-t0;
    console.log('OK', res.status, ms+'ms', url);
    return { ok:true, status:res.status, ms, url };
  }catch(e){
    const ms = Date.now()-t0;
    console.log('FAIL', 0, ms+'ms', url, e.message);
    return { ok:false, status:0, ms, url, error:e.message };
  }
}

const urls = [
  BASE+'/',
  BASE+'/status',
  BASE+'/marketplace',
  BASE+'/coaches',
  BASE+'/notifications'
];
const apis = [
  API+'/api/bff/health',
  API+'/api/bff/workouts/list'
];

const out = [];
for (const u of urls) out.push(await check(u));
for (const u of apis) out.push(await check(u));
console.log(JSON.stringify(out, null, 2));
