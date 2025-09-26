#!/usr/bin/env node
const fs = require('fs'), path=require('path'), https=require('https'), http=require('http');
const BASE = process.env.STAGING_BASE_URL || '';
const routes = ['/', '/workouts', '/nutrition', '/booking', '/vip'];
if (!BASE) { console.error('STAGING_BASE_URL is required'); process.exit(1); }
const out = path.join(process.cwd(), '.lighthouse-static');
fs.mkdirSync(out, { recursive: true });
function fetch(u, p){
  return new Promise((resolve) => {
    const lib = u.startsWith('https') ? https : http;
    lib.get(u, (res) => {
      let data=''; res.on('data', d=>data+=d); res.on('end',()=>{ fs.writeFileSync(path.join(out, p+'.html'), data); resolve(); });
    }).on('error', ()=>resolve());
  });
}
(async ()=>{
  for (const r of routes){
    const u = BASE.replace(/\/$/,'') + r;
    await fetch(u, r.replace(/^\//,'') || 'index');
  }
  console.log('Saved static pages to .lighthouse-static');
})();
