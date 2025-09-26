const fs = require('fs');
const path = require('path');
function extract(dir){
  const names = new Set();
  const files = [];
  (function walk(d){
    for (const e of fs.readdirSync(d)){
      const p = path.join(d, e);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else if (e.endsWith('.ts')) files.push(p);
    }
  })(dir);
  for (const f of files){
    const s = fs.readFileSync(f,'utf-8');
    const m1 = s.matchAll(/export\s+(?:interface|type)\s+([A-Za-z0-9_]+)/g);
    for (const m of m1) names.add(m[1]);
    const m2 = s.matchAll(/export\s+const\s+([A-Za-z0-9_]+)/g);
    for (const m of m2) names.add(m[1]);
    const m3 = s.matchAll(/export\s+enum\s+([A-Za-z0-9_]+)/g);
    for (const m of m3) names.add(m[1]);
  }
  return Array.from(names).sort();
}
const root = path.resolve(__dirname, '..');
const contracts = path.resolve(root, '..', 'contracts');
const out = path.join(root, 'snapshots', 'contracts.snapshot.json');
const data = { generatedAt: new Date().toISOString(), exports: extract(contracts) };
fs.writeFileSync(out, JSON.stringify(data, null, 2));
console.log('Snapshot written to', out);
