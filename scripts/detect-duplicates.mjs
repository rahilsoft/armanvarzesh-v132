import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { glob } from 'glob';

const root = process.cwd();
const paths = await glob("**/package.json", { cwd: root, ignore:["**/node_modules/**",".pnpm/**"]});
const names = {};
for(const p of paths){
  const json = JSON.parse(readFileSync(join(root,p),'utf8'));
  const name = json.name || "";
  if(!name) continue;
  names[name] ??= [];
  names[name].push(p);
}
const dups = Object.fromEntries(Object.entries(names).filter(([k,v])=>v.length>1));
console.log(JSON.stringify(dups,null,2));