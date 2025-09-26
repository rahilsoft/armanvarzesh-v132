// Simple a11y checker: scans TSX/JSX files for <img> without alt, <a> without href/name, and missing lang/dir in _document.
// Usage: node tools/audit/a11y-check.mjs <rootDir> <out.json>
import fs from 'fs'; import path from 'path';

function walk(dir, acc=[]){
  for(const f of fs.readdirSync(dir)){
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if(st.isDirectory()){ if(!/node_modules|\.next|dist|coverage/.test(p)) walk(p, acc); }
    else if(/\.(tsx|jsx|ts|js)$/.test(p)){ acc.push(p); }
  }
  return acc;
}

function checkFile(p){
  const src = fs.readFileSync(p, 'utf-8');
  const issues = [];
  // naive checks
  const rxImg = /<img(?![^>]*\balt=)[^>]*>/gi;
  const rxA = /<a(?![^>]*\b(href|onClick)=)[^>]*>(.*?)<\/a>/gi;
  let m;
  while((m = rxImg.exec(src))){ issues.push({ type:'img-missing-alt', file:p, index:m.index }); }
  while((m = rxA.exec(src))){ issues.push({ type:'anchor-missing-href', file:p, index:m.index }); }
  if(p.endsWith('/_document.tsx')){
    if(!/lang=\"(fa|en)\"/.test(src) || !/dir=\"(rtl|ltr)\"/.test(src)){
      issues.push({ type:'document-missing-lang-dir', file:p });
    }
  }
  return issues;
}

const root = process.argv[2] || process.cwd();
const out = process.argv[3] || 'reports/a11y-report.json';
const files = walk(root, []);
let issues = [];
for(const f of files){ issues = issues.concat(checkFile(f)); }
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ issues, total: issues.length }, null, 2));
console.log(`a11y issues: ${issues.length} -> ${out}`);
