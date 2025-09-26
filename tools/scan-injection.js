#!/usr/bin/env node
const fs = require('fs'); const path = require('path');
const ROOT = process.argv[2] || process.cwd();
const SQL_WORDS = ['select','insert','update','delete','into','from','where','join'];
function walk(dir, exts = ['.ts','.js']) { const out = []; for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) out.push(...walk(p, exts)); else if (exts.includes(path.extname(p))) out.push(p); } return out; }
function scanFile(p) { const text = fs.readFileSync(p, 'utf8'); const lines = text.split(/\r?\n/); const findings = []; lines.forEach((ln, i) => {
  if (ln.includes('$executeRawUnsafe') || ln.includes('$queryRawUnsafe')) findings.push({ line: i+1, kind: 'unsafe-raw', snippet: ln.trim() });
  if (ln.includes('`') && SQL_WORDS.some(w => ln.toLowerCase().includes(w))) { if (ln.includes('+') || ln.includes('${')) findings.push({ line: i+1, kind: 'template-sql', snippet: ln.trim() }); }
}); return findings; }
const files = walk(ROOT); let total = 0; files.forEach(f => { const fds = scanFile(f); if (fds.length) { console.log('>>', path.relative(ROOT, f)); fds.forEach(fd => console.log(`  [${fd.kind}] L${fd.line}: ${fd.snippet}`)); total += fds.length; } });
process.exitCode = total ? 1 : 0;
