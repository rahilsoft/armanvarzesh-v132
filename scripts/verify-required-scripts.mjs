import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { glob } from 'glob';

const REQUIRED = ["build","test","typecheck"];
const OPTIONAL = ["start","dev","lint"];

const root = process.cwd();
const paths = await glob("**/package.json", { cwd: root, ignore:["**/node_modules/**",".pnpm/**"]});
const rows = [];
for(const p of paths){
  const json = JSON.parse(readFileSync(join(root,p),'utf8'));
  const scripts = json.scripts || {};
  const missing = REQUIRED.filter(k=>!scripts[k]);
  rows.push({path:p, missing, optionalMissing: OPTIONAL.filter(k=>!scripts[k])});
}
console.log(JSON.stringify(rows,null,2));