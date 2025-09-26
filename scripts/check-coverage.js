#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const MIN_LINES = Number(process.env.MIN_LINES || 80);
const MIN_STMTS = Number(process.env.MIN_STATEMENTS || 80);
const MIN_FUNCS = Number(process.env.MIN_FUNCTIONS || 80);
const MIN_BRANCH= Number(process.env.MIN_BRANCHES || 70);

function findFiles(dir, name) {
  let out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(findFiles(p, name));
    else if (entry.isFile() && entry.name === name) out.push(p);
  }
  return out;
}

function sumCoverage(paths) {
  const total = { lines:{total:0, covered:0}, statements:{total:0, covered:0}, functions:{total:0, covered:0}, branches:{total:0, covered:0} };
  for (const p of paths) {
    try {
      const data = JSON.parse(fs.readFileSync(p,'utf8'));
      const s = data.total;
      for (const k of Object.keys(total)) {
        total[k].total   += (s[k]?.total || 0);
        total[k].covered += (s[k]?.covered || 0);
      }
    } catch {}
  }
  const pct = {};
  for (const k of Object.keys(total)) {
    pct[k] = total[k].total ? (100 * total[k].covered / total[k].total) : 0;
  }
  return { total, pct };
}

const root = process.cwd();
const files = findFiles(root, 'coverage-summary.json');
if (!files.length) {
  console.log('No coverage-summary.json files found.');
  process.exit(0);
}
const { pct } = sumCoverage(files);
console.log('Coverage %:', Object.fromEntries(Object.entries(pct).map(([k,v])=>[k, Number(v.toFixed(2))])));

const ok = (pct.lines>=MIN_LINES) && (pct.statements>=MIN_STMTS) && (pct.functions>=MIN_FUNCS) && (pct.branches>=MIN_BRANCH);
if (!ok) {
  console.error(`FAIL coverage thresholds: lines>=${MIN_LINES} statements>=${MIN_STMTS} functions>=${MIN_FUNCS} branches>=${MIN_BRANCH}`);
  process.exit(1);
}
console.log('PASS coverage thresholds');
