import { Controller, Post, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { IdempotencyService } from '../common/services/idempotency.service';
import * as crypto from 'crypto';
@Controller('payments')
export class WebhookController {
  constructor(private readonly idem: IdempotencyService) {}
  private verifySignature(rawBody: string, sigHeader: string|undefined, secret: string) {
    if (!sigHeader) return false;
    const h = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const expected = Buffer.from(h);
    const provided = Buffer.from(sigHeader);
    // timingSafeEqual throws RangeError on a length mismatch, which would turn
    // a forged short signature into a 500 rather than a rejected request.
    if (expected.length !== provided.length) return false;
    return crypto.timingSafeEqual(expected, provided);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('webhook')
  async handle(@Req() req: any, @Res() res: any) {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET || '';
    const sig = req.headers['x-signature'] as string | undefined;
    const raw = (req as any).rawBody || JSON.stringify(req.body || {});
    if (!secret || !this.verifySignature(raw, sig, secret)) {
      throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
    }
    const idem = req.headers['idempotency-key'] as string | undefined;
    if (idem) {
      const ok = await this.idem.checkAndSet(idem);
      if (!ok) { return res.status(200).json({ ok: true, duplicated: true }); }
    }
    // NOTE: validate signature + idempotency + update order state; emit outbox event check idempotency storage to prevent double processing
    // NOTE: validate signature + idempotency + update order state; emit outbox event update transaction/order state atomically
    res.status(200).json({ ok: true });
  }
}