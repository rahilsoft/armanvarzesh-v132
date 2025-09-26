#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function findFiles(dir, name) {
  let out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(findFiles(p, name));
    else if (entry.isFile() && entry.name === name) out.push(p);
  }
  return out;
}

const root = process.cwd();
const pkgFiles = findFiles(root, 'package.json');
let missing = [];

for (const p of pkgFiles) {
  const dir = path.dirname(p);
  const readme = path.join(dir, 'README.md');
  if (!fs.existsSync(readme)) {
    missing.push(readme);
  }
}

if (!fs.existsSync(path.join(root, '.github', 'CODEOWNERS'))) missing.push('.github/CODEOWNERS');
if (!fs.existsSync(path.join(root, 'SECURITY.md'))) missing.push('SECURITY.md');
if (!fs.existsSync(path.join(root, 'CONTRIBUTING.md'))) missing.push('CONTRIBUTING.md');

if (missing.length) {
  console.error('Missing required docs:');
  for (const m of missing) console.error(' - ' + m);
  process.exit(1);
} else {
  console.log('All required docs are present.');
}
