import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class WebhookSignatureGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req: any = ctx.switchToHttp().getRequest();
    const secret = process.env.PAYMENT_WEBHOOK_SECRET || '';
    const sigHeader = req.headers['x-signature'] || req.headers['x-hub-signature-256'] || '';
    if (!secret) {
      // Fail closed in production: an unset secret used to wave every webhook
      // through unverified, so a misconfigured deploy silently accepted forged
      // callbacks. Outside production it stays permissive for local testing.
      if (process.env.NODE_ENV === 'production') {
        throw new UnauthorizedException('Webhook secret is not configured');
      }
      return true;
    }
    if (!sigHeader) throw new UnauthorizedException('Missing signature header');

    const raw = req.rawBody ? Buffer.from(req.rawBody) : Buffer.from(JSON.stringify(req.body));
    const h = crypto.createHmac('sha256', secret).update(raw).digest('hex');
    const expected = Buffer.from(`sha256=${h}`);
    const provided = Buffer.from(String(sigHeader).trim());
    // timingSafeEqual throws RangeError when the buffers differ in length, so a
    // short or truncated signature would surface as a 500 instead of a 401.
    if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
      throw new UnauthorizedException('Invalid signature');
    }
    return true;
  }
}
