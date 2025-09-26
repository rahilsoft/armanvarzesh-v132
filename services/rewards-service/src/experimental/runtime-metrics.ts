/* Stage 39 — runtime /metrics (conditional) */
import type { INestApplication } from '@nestjs/common';
export async function wireMetrics(app: INestApplication){
  const http = app.getHttpAdapter(); const inst:any = http && (http as any).getInstance ? (http as any).getInstance() : null; if(!inst) return;
  let client:any = null; try{ client = await import('prom-client'); }catch{}
  inst.get('/metrics', async (_req:any, res:any)=>{
    if(!client){ res.status(501).send('# prom-client not installed'); return; }
    try{ const r = await client.register.metrics(); res.set('Content-Type', client.register.contentType); res.send(r); }catch{ res.status(500).send('metrics error'); }
  });
}
