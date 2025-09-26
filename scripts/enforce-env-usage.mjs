// Scan for process.env.X and enforce against .env.allow
import { glob } from 'glob';
import { readFileSync } from 'node:fs';
const allow = new Set(readFileSync('.env.allow', 'utf8').split(/\r?\n/).map(s=>s.trim()).filter(Boolean));
const files = await glob('**/*.{ts,tsx,js,jsx}', { ignore:['**/node_modules/**','.pnpm/**','**/dist/**'] });
const regex = /process\.env\.([A-Z0-9_]+)/g;
const offenders = new Map();
for(const f of files){
  const txt = readFileSync(f,'utf8');
  let m; while((m = regex.exec(txt))){
    const key = m[1];
    if(!allow.has(key)){
      if(!offenders.has(key)) offenders.set(key, []);
      offenders.get(key).push(f);
    }
  }
}
if(offenders.size>0){
  console.error('Unapproved env vars found:');
  for(const [k,files] of offenders){
    console.error(' -', k, '=>', Array.from(new Set(files)).slice(0,5).join(', '), files.length>5?'...':'');
  }
  process.exit(1);
} else {
  console.log('Env allowlist clean.');
}