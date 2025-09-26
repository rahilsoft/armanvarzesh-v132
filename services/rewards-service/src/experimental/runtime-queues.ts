/* Stage 21 — Runtime Queues Health (conditional) */
import type { INestApplication } from '@nestjs/common';
export async function wireQueuesHealth(app: INestApplication){
  const http = app.getHttpAdapter();
  const inst:any = http && (http as any).getInstance ? (http as any).getInstance() : null;
  if(!inst) return;
  inst.get('/queues/health', (_req:any, res:any)=> res.json({ ok:true, queues:'up' }));
}
