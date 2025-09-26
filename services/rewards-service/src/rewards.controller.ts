import { Body, Controller, Get, Post, Req, ForbiddenException } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { subjectFromReq } from '@arman/security-middleware';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly svc: RewardsService){}
  private subject(req:any){ const s = subjectFromReq(req); if(!s) throw new ForbiddenException('AUTH_REQUIRED'); return s; }

  @Get('mine')
  my(@Req() req:any){ return this.svc.myRewards(this.subject(req)); }

  @Get('vip')
  vip(@Req() req:any){ return this.svc.myVipStatus(this.subject(req)); }

  @Post('claimBadge')
  claim(@Req() req:any, @Body() body:{ badgeId:string }){ return this.svc.claimBadge(this.subject(req), body.badgeId); }

  @Post('createReferral')
  createReferral(@Req() req:any){ return this.svc.createReferral(this.subject(req)); }

  @Post('useReferral')
  useReferral(@Req() req:any, @Body() body:{ code:string }){ return this.svc.useReferral(body.code, this.subject(req)); }

  @Post('payoutCommission')
  payout(@Req() req:any){ return this.svc.payoutCommission(this.subject(req)); }

  @Post('ingest')
  ingest(@Req() req:any, @Body() body:{ type:string, amount:number, meta?:any, idempotencyKey:string }){
    return this.svc.ingestEvent(this.subject(req), body.type, body.amount, body.meta, body.idempotencyKey);
  }
}
