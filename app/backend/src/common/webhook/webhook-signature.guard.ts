import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class WebhookSignatureGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req: any = ctx.switchToHttp().getRequest();
    const secret = process.env.PAYMENT_WEBHOOK_SECRET || '';
    const sigHeader = req.headers['x-signature'] || req.headers['x-hub-signature-256'] || '';
    if (!secret) return true; // allow if not configured
    if (!sigHeader) throw new UnauthorizedException('Missing signature header');

    const raw = req.rawBody ? Buffer.from(req.rawBody) : Buffer.from(JSON.stringify(req.body));
    const h = crypto.createHmac('sha256', secret).update(raw).digest('hex');
    const expected = `sha256=${h}`;
    const provided = String(sigHeader).trim();
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided))) {
      throw new UnauthorizedException('Invalid signature');
    }
    return true;
  }
}
