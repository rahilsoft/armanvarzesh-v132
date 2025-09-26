
// Simple latency harness using fetch; for real load use autocannon/k6.
// Usage: node scripts/latency-check.js http://localhost:8080/v1/habits/today 50
const url = process.argv[2]; const n = Number(process.argv[3]||50);
if(!url){ console.error('Usage: node latency-check.js <url> [n]'); process.exit(1); }
const fetch = global.fetch || require('node-fetch');

(async ()=>{
  const times = [];
  for(let i=0;i<n;i++){
    const t0 = Date.now(); try{ await fetch(url); } catch(e){} times.push(Date.now()-t0);
  }
  times.sort((a,b)=>a-b);
  const p50 = times[Math.floor(0.5*times.length)];
  console.log(JSON.stringify({ p50_ms: p50, n }));
  if(p50 > 150){ process.exitCode = 2; }
})();
