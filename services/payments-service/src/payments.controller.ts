import { Body, Controller, Get, Post, Query, Req, ForbiddenException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { subjectFromReq } from '@arman/security-middleware';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly svc: PaymentsService){}
  private subject(req:any){ const s = subjectFromReq(req); if(!s) throw new ForbiddenException('AUTH_REQUIRED'); return s; }

  @Post('checkout')
  checkout(@Req() req:any, @Body() body:{ productId:string, metadata?:any }){
    return this.svc.checkout(this.subject(req), body.productId, body.metadata);
  }

  @Post('webhook')
  webhook(@Body() body:{ provider:string, eventId:string, type:string, payload:any }){
    return this.svc.webhook(body.provider, body.eventId, body.type, body.payload);
  }

  @Post('change-plan')
  change(@Req() req:any, @Body() body:{ newPlanId:string }){
    return this.svc.changePlan(this.subject(req), body.newPlanId);
  }

  // util: seed products
  @Post('seed')
  seed(){ return this.svc.seedProducts(); }
}

@Get('my-subscription')
mySub(@Req() req:any){
  const userId = this.subject(req);
  return this.svc.prisma.subscription.findFirst({ where: { userId, status: 'active' } });
}
