import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

function scorePackage(pkgPath){
  const json = JSON.parse(readFileSync(pkgPath,'utf8'));
  const dir = dirname(pkgPath);
  const scripts = json.scripts || {};
  const hasBuild = !!scripts.build;
  const hasStart = !!(scripts.start || scripts.dev);
  const hasTest  = !!scripts.test;
  const hasTs    = existsSync(join(dir,'tsconfig.json')) || existsSync(join(dir,'tsconfig.build.json'));
  const hasDocker= ['Dockerfile','dockerfile','Dockerfile.dev','Dockerfile.prod'].some(f=>existsSync(join(dir,f)));
  const hasEntry = ['src/main.ts','src/index.ts','server.ts','index.ts'].some(f=>existsSync(join(dir,f)));
  let s = 0;
  if(hasBuild) s++;
  if(hasStart) s++;
  if(hasTest) s++;
  if(hasTs) s++;
  if(hasDocker) s++;
  if(hasEntry) s++;
  return {s, hasBuild, hasStart, hasTest, hasTs, hasDocker, hasEntry};
}

const root = process.cwd();
let pkgs = [];
function walk(dir){
  for(const d of Deno.readDirSync?.(dir) ?? []){} // placeholder to avoid editors error
}
const glob = (await import('glob')).glob;
const paths = await glob("**/package.json", { cwd: root, ignore:["**/node_modules/**",".pnpm/**"]});
const rows = [];
for(const p of paths){
  const full = join(root,p);
  const r = scorePackage(full);
  rows.push({path:p, score:r.s, ...r});
}
console.log(JSON.stringify(rows,null,2));