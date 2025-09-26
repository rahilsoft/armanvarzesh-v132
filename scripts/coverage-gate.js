
const fs = require('fs');
const path = process.argv[2] || 'coverage/coverage-summary.json';
if (!fs.existsSync(path)) { console.error('No coverage summary at', path); process.exit(2); }
const sum = JSON.parse(fs.readFileSync(path,'utf8'));
const t = sum.total;
const ok = (t.lines.pct >= 80) && (t.statements.pct >= 80) && (t.functions.pct >= 80) && (t.branches.pct >= 70);
console.log(JSON.stringify({ lines:t.lines.pct, statements:t.statements.pct, functions:t.functions.pct, branches:t.branches.pct, ok }));
process.exit(ok ? 0 : 3);
