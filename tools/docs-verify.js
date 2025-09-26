#!/usr/bin/env node
// Simple local Markdown link checker (no network).
// Exits non-zero if any relative links are broken.
const fs = require('fs'); const path = require('path');

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.git')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) yield p;
  }
}

const root = process.cwd();
let broken = [];
for (const file of walk(root)) {
  const txt = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  const rx = /\[[^\]]+\]\(([^)]+)\)/g;
  let m;
  while ((m = rx.exec(txt))) {
    const target = m[1];
    if (/^https?:\/\//i.test(target)) continue; // skip external
    const abs = path.resolve(dir, target.split('#')[0]);
    if (!fs.existsSync(abs)) {
      broken.push(`${file}: ${target}`);
    }
  }
}
if (broken.length) {
  console.error('Broken links:');
  for (const b of broken) console.error('  - ' + b);
  process.exit(2);
} else {
  console.log('All local links OK.');
}
