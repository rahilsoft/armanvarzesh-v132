import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

function ipFrom(req:any): string {
  const xf = (req.headers['x-forwarded-for'] || '') as string;
  if (xf) return xf.split(',')[0].trim();
  return (req.ip || req.socket?.remoteAddress || '') as string;
}

@Injectable()
export class MetricsGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const token = (req.headers['authorization'] || '').toString().replace(/^Bearer\s+/i,'');
    const expected = process.env.METRICS_TOKEN;
    if (expected && token === expected) return true;
    const ip = ipFrom(req);
    const allow = (process.env.METRICS_ALLOW_FROM || '').split(',').map(s=>s.trim()).filter(Boolean);
    if (allow.length && allow.some(a => ip.startsWith(a))) return true;
    throw new UnauthorizedException('forbidden metrics');
  }
}
