// Compute 10-point score for each package
import { glob } from 'glob';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

function readJSON(p){ try{ return JSON.parse(readFileSync(p,'utf8')); }catch{ return {}; } }

function hasAny(dir, names){ return names.some(n=>existsSync(join(dir,n))); }

const pkgs = (await glob('**/package.json', { ignore:['**/node_modules/**','.pnpm/**'] }))
  .map(p=>({ path: dirname(p), json: readJSON(p) }));

function framework(pkg){
  const d = { ...(pkg.json.dependencies||{}), ...(pkg.json.devDependencies||{}) };
  const s = pkg.json.scripts||{};
  if (d.next || /next/.test(s.build||'')) return 'Next';
  if (Object.keys(d).some(k=>k.startsWith('@nestjs/'))) return 'Nest';
  if (d.express) return 'Express';
  if (d.vite) return 'Vite';
  if (d.expo || d['react-native']) return 'Expo';
  return 'Unknown';
}

const rows = pkgs.map(({path:dir,json})=>{
  const s = json.scripts||{};
  let score = 0;
  // 1) build/start/test
  if (s.build) score+=1;
  if (s.start || s.dev) score+=1;
  if (s.test) score+=1;
  // 2) typescript configs
  if (hasAny(dir,['tsconfig.json','tsconfig.build.json'])) score+=1;
  // 3) entry
  if (hasAny(dir,['src/main.ts','src/index.ts','src/server.ts','index.ts'])) score+=1;
  // 4) dockerfile for apps
  const fw = framework({json, path:dir});
  if (['Nest','Express','Next'].includes(fw) && hasAny(dir,['Dockerfile','dockerfile','Dockerfile.dev','Dockerfile.prod'])) score+=1;
  // 5) observability wiring (import register in entry)
  const obs = ['src/main.ts','src/index.ts','src/server.ts'].some(f=>{ try{ return readFileSync(join(dir,f),'utf8').includes(\"@arman/observability-sdk/register\"); }catch{return false;} });
  if (obs) score+=1;
  // 6) security hardening (applyBasicHardening)
  const sec = ['src/main.ts','src/index.ts','src/server.ts'].some(f=>{ try{ return readFileSync(join(dir,f),'utf8').includes('applyBasicHardening('); }catch{return false;} });
  if (sec) score+=1;
  // 7) libs: exports fields
  const isLib = fw==='Unknown' || fw==='Vite';
  if (isLib){
    if (json.main && json.module && json.types && json.exports) score+=1;
  }
  // 8) web apps: PWA assets
  const hasPWA = hasAny(dir, ['public/manifest.webmanifest']) && hasAny(dir, ['public/sw.js']);
  if (['Next','Vite'].includes(fw) && hasPWA) score+=1;
  // Cap at 10
  if (score>10) score=10;
  return { dir, name: json.name||'', fw, score };
});

const summary = {
  updatedAt: new Date().toISOString(),
  packages: rows,
  byScore: rows.reduce((acc,r)=>{ acc[r.score]=(acc[r.score]||0)+1; return acc; },{})
};
console.log(JSON.stringify(summary,null,2));