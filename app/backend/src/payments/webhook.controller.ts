import { PrismaService } from '../database/prisma.service';
import { Controller, Post, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { IdempotencyService } from '../common/services/idempotency.service';
import * as crypto from 'crypto';
@Controller('payments')
export class WebhookController {
  constructor(private readonly idem: IdempotencyService) {}
  private verifySignature(rawBody: string, sigHeader: string|undefined, secret: string) {
    if (!sigHeader) return false;
    const h = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(sigHeader));
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('webhook')
  async handle(@Req() req, @Res() res) {
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