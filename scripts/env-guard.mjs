// Scan repo for process.env usage and fail if unknown keys are used and not documented in env.allowed.json
import { glob } from 'glob';
import { readFileSync } from 'node:fs';

const allow = new Set(JSON.parse(readFileSync('env.allowed.json','utf8')).allowed || []);

const files = await glob("**/*.{ts,tsx,js,jsx}", { ignore:["**/node_modules/**",".pnpm/**","**/dist/**"] });
const found = new Set();
for (const f of files) {
  const txt = readFileSync(f,'utf8');
  const re = /process\.env\.([A-Z0-9_]+)/g;
  let m;
  while ((m = re.exec(txt)) !== null) found.add(m[1]);
}

const unknown = [...found].filter(k => !allow.has(k)).sort();
if (unknown.length) {
  console.error("Unknown/undocumented env keys:", unknown.join(", "));
  console.error("Add them to env.allowed.json (or rename).");
  process.exit(1);
} else {
  console.log("Env guard OK. Keys used:", [...found].sort().join(", "));
}