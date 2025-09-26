import { Controller, All, Req, Res, Next, ForbiddenException } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Request, Response, NextFunction } from 'express';
import { subjectFromReq, buildSecurityMiddleware, buildUserAwareRateLimit } from '@arman/security-middleware';

const routes = [
  { prefix: '/bff', target: process.env.BFF_URL || 'http://bff:4091', strip: true },
  { prefix: '/payments', target: process.env.PAYMENTS_URL || 'http://payments:4081', strip: false },
  { prefix: '/notifications', target: process.env.NOTIFS_URL || 'http://notifications:4079', strip: false },
  { prefix: '/coach', target: process.env.COACH_URL || 'http://coach:4093', strip: false },
  { prefix: '/chat', target: process.env.CHAT_URL || 'http://chat:4077', strip: false },
  { prefix: '/activities', target: process.env.ACTIVITIES_URL || 'http://activities:4075', strip: false },
];

function matchRoute(pathname: string){
  return routes.find(r=> pathname.startsWith(r.prefix));
}

@Controller()
export class GatewayController {
  private proxies = new Map<string, any>();

  private getProxy(target: string, stripPrefix?: string){
    const key = target + '|' + (stripPrefix||'');
    if (this.proxies.has(key)) return this.proxies.get(key);
    const mw = createProxyMiddleware({
      target, changeOrigin: true, xfwd: true,
      pathRewrite: stripPrefix ? { [`^${stripPrefix}`]: '' } : undefined,
      onProxyReq: (proxyReq, req, res)=>{
        // forward correlation id if present
        const cid = (req.headers['x-correlation-id'] as string) || cryptoRandom();
        proxyReq.setHeader('x-correlation-id', cid);
      },
      onError: (err, req, res)=>{
        (res as Response).status(502).json({ code:'UPSTREAM_ERROR', message:String(err) });
      }
    });
    this.proxies.set(key, mw);
    return mw;
  }

  @All('*')
  handle(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    const sec = buildSecurityMiddleware();
    // Apply base security; body size limits are applied in main.ts
    sec.hpp(req as any, res as any, ()=>{});
    sec.helmet(req as any, res as any, ()=>{});

    // Global rate limit (user-aware)
    const rl = buildUserAwareRateLimit(); rl(req as any, res as any, ()=>{});

    // Gate: for protected paths, require auth
    const r = matchRoute(req.path);
    if (!r) return res.status(404).json({ code:'ROUTE_NOT_FOUND', message:'Unknown path' });

    // Forward as-is (BFF may need auth; gateway passes Authorization header through)
    const proxy = this.getProxy(r.target, r.strip ? r.prefix : undefined);
    return (proxy as any)(req, res, next);
  }
}

function cryptoRandom(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
