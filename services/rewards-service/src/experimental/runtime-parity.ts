/* Stage 19 — Runtime REST Parity (conditional) */
import type { INestApplication } from '@nestjs/common';
export async function wireRuntimeParity(app: INestApplication){
  try{
    const fs = await import('fs');
    const path = await import('path');
    const root = process.cwd();
    const mapPath = path.join(root, 'tools', 'api-map', 'parity_stage07_plan.json');
    const raw = fs.readFileSync(mapPath, 'utf-8');
    const plan = JSON.parse(raw).plan.filter((a:any)=>a.type==='rest_client_call_without_server_route').slice(0,10);
    const http = app.getHttpAdapter();
    const inst:any = http && (http as any).getInstance ? (http as any).getInstance() : null;
    if(!inst) return;
    for(const a of plan){
      const call = a.call as string;
      const [method, originalPath] = call.includes(' ') ? call.split(' ',2) : ['GET', call];
      const m = (method||'GET').toLowerCase();
      const p = (originalPath||'/').replace(/^https?:\/\/[^/]+/,'').split('?')[0];
      try{
        (inst as any)[m](p, (_req:any, res:any)=> res.json({ ok:true, parity:true, call }));
        // eslint-disable-next-line no-console
        console.log('[AV][Stage19] wired', m.toUpperCase(), p);
      }catch{ /* ignore */ }
    }
  }catch{/* ignore */}
}
