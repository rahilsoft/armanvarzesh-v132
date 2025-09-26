import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
function genId(){ return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`; }
@Injectable()
export class LoggingInterceptor implements NestInterceptor { intercept(ctx:ExecutionContext,next:CallHandler):Observable<any>{ const req:any = ctx.switchToHttp().getRequest(); const id=(req?.headers['x-request-id'] as string)||genId(); if(req?.res) req.res.setHeader('X-Request-Id', id); const st=Date.now(); return next.handle().pipe(tap(()=>{ const dur=Date.now()-st; const method=req?.method; const url=req?.url; console.log(JSON.stringify({level:'info', msg:'request', id, method, url, dur})); })); } }
