import { printSchema, getIntrospectionQuery, buildClientSchema } from 'graphql';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';

async function fetchRemoteSDL(endpoint: string){
  const q = getIntrospectionQuery();
  const res = await fetch(endpoint, { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ query: q })});
  if (!res.ok) throw new Error('HTTP '+res.status);
  const json = await res.json();
  const schema = buildClientSchema(json.data);
  return printSchema(schema);
}

async function run(){
  const endpoint = process.argv[2] || 'http://localhost:4091/graphql';
  const remote = await fetchRemoteSDL(endpoint);
  const local = readFileSync('schema.snapshot.graphql','utf8');
  const diff = compareSDL(local, remote);
  if (diff.changed) {
    console.error('Schema drift detected:\n'+diff.report);
    process.exit(2);
  } else {
    console.log('Schema matches snapshot.');
  }
}

function compareSDL(a: string, b: string){
  if (a.trim() === b.trim()) return { changed: false, report: '' };
  // naive line-by-line diff report
  const al = a.trim().split('\n'); const bl = b.trim().split('\n');
  const report = ['--- SNAPSHOT','+++ RUNTIME'];
  for (let i=0; i<Math.max(al.length, bl.length); i++){
    if (al[i] !== bl[i]){
      report.push(`- ${al[i]||''}`);
      report.push(`+ ${bl[i]||''}`);
    }
  }
  return { changed: true, report: report.join('\n') };
}

run().catch(e=>{ console.error(e); process.exit(1); });
