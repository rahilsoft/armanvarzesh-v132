const fs = require('fs');
const path = require('path');

function loadJSON(p){ return JSON.parse(fs.readFileSync(p,'utf-8')); }

describe('contracts compat', () => {
  it('should not remove exported symbols compared to snapshot', () => {
    const root = path.resolve(__dirname, '..');
    const snap = loadJSON(path.join(root, 'snapshots', 'contracts.snapshot.json'));
    const base = path.resolve(root, '..', 'contracts');
    // naive export extraction (JS): look for 'export interface|type|const|enum NAME'
    function extractExports(dir){
      const names = new Set();
      const files = [];
      (function walk(d){
        for (const e of fs.readdirSync(d)){
          const p = path.join(d, e);
          const stat = fs.statSync(p);
          if (stat.isDirectory()) walk(p);
          else if (e.endsWith('.ts')) files.push(p);
        }
      })(dir);
      for (const f of files){
        const s = fs.readFileSync(f, 'utf-8');
        const m1 = s.matchAll(/export\s+(?:interface|type)\s+([A-Za-z0-9_]+)/g);
        for (const m of m1) names.add(m[1]);
        const m2 = s.matchAll(/export\s+const\s+([A-Za-z0-9_]+)/g);
        for (const m of m2) names.add(m[1]);
        const m3 = s.matchAll(/export\s+enum\s+([A-Za-z0-9_]+)/g);
        for (const m of m3) names.add(m[1]);
      }
      return Array.from(names).sort();
    }
    const now = extractExports(base);
    const missing = snap.exports.filter((name) => !now.includes(name));
    if (missing.length){
      throw new Error('Removed/renamed exports: ' + missing.join(', '));
    }
  });
});
