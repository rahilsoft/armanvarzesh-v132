#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
const root = process.argv[2] || process.cwd();
const report = { scanned: 0, hardcoded_strings: [] };
function walk(dir){
  for(const name of readdirSync(dir)){
    const p = join(dir, name);
    const st = statSync(p);
    if(st.isDirectory()){
      if(name==='node_modules' || name==='.next') continue;
      walk(p);
    }else if(/\.(tsx?|jsx?)$/.test(name)){
      const txt = readFileSync(p,'utf8');
      report.scanned++;
      const matches = txt.match(/>[^<{\n}][^<>{}]{2,}</g) || [];
      for(const m of matches){
        const s = m.slice(1,-1).trim();
        if(/[\u0600-\u06FF]/.test(s) || /[A-Za-z]{3,}/.test(s)){
          if(!/t\(/.test(txt)) report.hardcoded_strings.push({ file:p, sample:s.slice(0,80) });
        }
      }
    }
  }
}
walk(root);
const out = process.argv[3] || join(root, 'reports/i18n-report.json');
writeFileSync(out, JSON.stringify(report, null, 2), 'utf8');
console.log('i18n audit ->', out, 'items:', report.hardcoded_strings.length);
