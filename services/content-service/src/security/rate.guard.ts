
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

type Bucket = { tokens: number; updated: number };
const buckets = new Map<string, Bucket>();

function keyFrom(ctx: any){
  const ip = ctx?.headers?.['x-forwarded-for'] || ctx?.ip || ctx?.socket?.remoteAddress || 'anon';
  const sub = ctx?.user?.sub || ctx?.headers?.authorization || 'noauth';
  return String(ip) + '|' + String(sub).slice(0,16);
}

@Injectable()
export class RateGuard implements CanActivate {
  constructor(private limitPerMin = 60){}
  canActivate(context: ExecutionContext): boolean {
    const req: any = context.switchToHttp().getRequest?.() || context.getArgByIndex?.(2)?.req;
    const key = keyFrom(req);
    const now = Date.now();
    const b = buckets.get(key) || { tokens: this.limitPerMin, updated: now };
    const elapsed = (now - b.updated) / 60000;
    b.tokens = Math.min(this.limitPerMin, b.tokens + elapsed * this.limitPerMin);
    if (b.tokens < 1) { buckets.set(key, b); return false; }
    b.tokens -= 1; b.updated = now; buckets.set(key, b);
    return true;
  }
}
