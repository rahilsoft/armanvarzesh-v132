import { Body, Controller, Get, Param, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { ChatService } from './chat.service';
import { identityFromReq } from './auth/req-user';

@Controller('chat')
export class ChatController {
  constructor(private readonly svc: ChatService){}

  /**
   * Reading a thread requires a verified token AND membership of that thread.
   * This route previously took the thread id alone, so anyone could read any
   * conversation in the system.
   */
  @Get('history/:threadId')
  async history(@Req() req:any, @Param('threadId') id:string, @Query('limit') limit?:string, @Query('cursor') cursor?:string){
    const { userId } = identityFromReq(req);
    await this.svc.assertParticipant(id, userId);
    const parsed = Number(limit);
    const take = Number.isFinite(parsed) ? Math.min(Math.max(Math.trunc(parsed), 1), 100) : 50;
    return this.svc.history(id, take, cursor);
  }

  @Post('attachments/presign')
  async presign(@Req() req:any, @Body() body:{ kind:string, sizeBytes:number, mime:string }){
    identityFromReq(req);
    return this.svc.presignUpload(body.kind, body.sizeBytes, body.mime);
  }

  /**
   * Scanner callback. The result decides whether a quarantined upload becomes
   * publicly downloadable, so it is HMAC-verified and fails closed when
   * CHAT_SCAN_WEBHOOK_SECRET is unset — an unauthenticated caller could
   * otherwise mark malicious files 'safe'.
   */
  @Post('webhooks/scan-result')
  scan(@Req() req:any, @Body() body:{ attachmentId:string, safe:boolean }){
    this.verifyScanSignature(req);
    return this.svc.onScanResult(body.attachmentId, !!body.safe);
  }

  private verifyScanSignature(req: any){
    const secret = process.env.CHAT_SCAN_WEBHOOK_SECRET || '';
    if (!secret) throw new UnauthorizedException('scan webhook secret is not configured');

    const provided = String(req?.headers?.['x-signature'] || '').trim();
    if (!provided) throw new UnauthorizedException('missing signature header');

    const raw = req?.rawBody ? Buffer.from(req.rawBody) : Buffer.from(JSON.stringify(req?.body ?? {}));
    const digest = crypto.createHmac('sha256', secret).update(raw).digest('hex');
    const expected = `sha256=${digest}`;

    const a = Buffer.from(expected);
    const b = Buffer.from(provided);
    // timingSafeEqual throws on length mismatch, so compare lengths first.
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      throw new UnauthorizedException('invalid signature');
    }
  }
}
