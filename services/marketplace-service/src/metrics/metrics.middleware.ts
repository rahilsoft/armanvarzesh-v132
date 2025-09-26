import { Injectable, NestMiddleware } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';
import type { Request, Response, NextFunction } from 'express';
const httpRequestsTotal = new Counter({ name:'http_requests_total', help:'Total number of HTTP requests', labelNames:['method','route','status'] });
const httpRequestDurationSeconds = new Histogram({ name:'http_request_duration_seconds', help:'Duration of HTTP requests in seconds', labelNames:['method','route','status'], buckets:[0.01,0.05,0.1,0.3,0.5,1,2,5] });
@Injectable()
export class MetricsMiddleware implements NestMiddleware { use(req:Request,res:Response,next:NextFunction){ if(String(process.env.METRICS_ENABLED||'true')!=='true') return next(); const start=process.hrtime.bigint(); res.on('finish',()=>{ const diff=Number(process.hrtime.bigint()-start)/1e9; const route=(req as any).route?.path || req.path || 'unknown'; const labels={ method:req.method, route, status:String(res.statusCode) }; httpRequestsTotal.inc(labels,1); httpRequestDurationSeconds.observe(labels,diff); }); next(); } }
