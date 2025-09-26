const fs = require('fs');
const path = require('path');

function walk(dir, acc=[]) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.git')) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const root = process.cwd();
const files = walk(root);
const envExamples = files.filter(f => f.endsWith('.env.example'));
const keys = new Map();
for (const f of envExamples) {
  const rel = path.relative(root, f);
  const content = fs.readFileSync(f, 'utf8');
  for (const ln of content.split(/\r?\n/)) {
    if (!ln || ln.trim().startsWith('#')) continue;
    const m = ln.match(/^([A-Za-z_][A-Za-z0-9_]*)=/);
    if (m) {
      const k = m[1];
      if (!keys.has(k)) keys.set(k, new Set());
      keys.get(k).add(rel);
    }
  }
}
const out = [];
out.push('# ENV KEYS REPORT');
out.push('');
out.push(`Collected at: ${new Date().toISOString()}`);
out.push('');
for (const [k, sources] of Array.from(keys.entries()).sort((a,b)=>a[0].localeCompare(b[0]))) {
  out.push(`- **${k}**: in ${Array.from(sources).join(', ')}`);
}
fs.mkdirSync(path.join(root, 'docs'), {recursive:true});
fs.writeFileSync(path.join(root, 'docs', 'ENV_KEYS_REPORT.md'), out.join('\n'), 'utf8');
console.log('Wrote docs/ENV_KEYS_REPORT.md with', keys.size, 'keys.');
