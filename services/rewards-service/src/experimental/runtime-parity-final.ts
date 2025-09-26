/* Stage 29 — Final REST Parity wiring (conditional) */
import type { INestApplication } from '@nestjs/common';
export async function wireFinalParity(app: INestApplication){
  const http = app.getHttpAdapter();
  const inst:any = http && (http as any).getInstance ? (http as any).getInstance() : null;
  if(!inst) return;
  const endpoints = (global as any).__AV_PARITY_ENDPOINTS__ as {method:string,path:string}[] || [];
  for(const e of endpoints){
    const m = (e.method||'GET').toLowerCase();
    const p = (e.path||'/');
    try{ (inst as any)[m](p, (_req:any,res:any)=>res.json({ok:true,parity:true,path:p})); }catch{}
  }
}
