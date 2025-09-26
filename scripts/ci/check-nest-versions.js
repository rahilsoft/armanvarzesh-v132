
const fs=require('fs'),path=require('path');const ROOT=process.cwd();
const TARGETS={'@nestjs/config':/^\^?4\./,'@nestjs/passport':/^\^?11\./,'@nestjs/jwt':/^\^?11\./,'@nestjs/terminus':/^\^?11\./,'@nestjs/cli':/^\^?11\./};
let bad=0;function scan(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);
if(e.isDirectory()){if(['node_modules','.git','.next','dist','build','.pnpm'].includes(e.name))continue;scan(p);}
else if(e.isFile()&&e.name==='package.json'){try{const data=JSON.parse(fs.readFileSync(p,'utf8'));
for(const s of ['dependencies','devDependencies','peerDependencies','optionalDependencies']){const deps=data[s]||{};
for(const [n,v] of Object.entries(deps)){if(TARGETS[n]&&!TARGETS[n].test(String(v))){console.error(`✖ Invalid version for ${n} in ${path.relative(ROOT,p)}: ${v}`);bad++;}}}}catch{}}}}
scan(ROOT);if(bad){console.error('\nFix the versions above or rely on root pnpm.overrides.');process.exit(1);}else{console.log('✓ Nest package versions look OK.');}
