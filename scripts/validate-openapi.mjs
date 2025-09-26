// Validate any openapi.(json|yaml|yml) in repo using swagger-parser
import { glob } from 'glob';
import { readFileSync } from 'node:fs';
import SwaggerParser from '@apidevtools/swagger-parser';
import YAML from 'yaml';

const files = await glob("**/*.{json,yaml,yml}", { ignore:["**/node_modules/**",".pnpm/**"] });
const candidates = files.filter(f=>/openapi\.(json|ya?ml)$/i.test(f) || /\bopenapi\b/i.test(f));
if(candidates.length===0){ console.log("No OpenAPI files found."); process.exit(0); }

let failed = 0;
for(const f of candidates){
  try{
    const raw = readFileSync(f, 'utf8');
    const doc = f.endsWith(".json") ? JSON.parse(raw) : YAML.parse(raw);
    await SwaggerParser.validate(doc);
    console.log("OK:", f);
  } catch(e){
    failed++; console.error("Invalid OpenAPI:", f, e?.message||e);
  }
}
if(failed>0){ process.exit(1); }
