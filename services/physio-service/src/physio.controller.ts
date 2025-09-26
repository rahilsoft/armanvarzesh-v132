import { Body, Controller, Get, Param, Post, Query, Req, ForbiddenException } from '@nestjs/common';
import { PhysioService } from './physio.service';
import { subjectFromReq } from '@arman/security-middleware';

@Controller('physio')
export class PhysioController {
  constructor(private readonly svc: PhysioService) {}

  private subject(req:any){ const s = subjectFromReq(req); if(!s) throw new ForbiddenException('AUTH_REQUIRED'); return s; }

  @Post('assign')
  assign(@Req() req:any, @Body() body:{userId:string, protocolId:string}) {
    const sub = this.subject(req);
    if (sub !== body.userId) throw new ForbiddenException('NOT_OWNER');
    return this.svc.assignProtocol(sub, body.protocolId);
  }

  @Get('plan/:userId')
  myPlan(@Req() req:any, @Param('userId') userId: string) {
    const sub = this.subject(req);
    if (sub !== userId) throw new ForbiddenException('NOT_OWNER');
    return this.svc.myPlan(sub);
  }

  @Post('session/:sessionId/complete')
  complete(@Req() req:any, @Param('sessionId') sessionId: string) {
    const sub = this.subject(req);
    return this.svc.completeSession(sessionId, sub);
  }

  @Post('session/:sessionId/pain')
  logPain(@Req() req:any, @Param('sessionId') sessionId: string, @Body() body:{score:number, notes?:string}) {
    const sub = this.subject(req);
    return this.svc.logPain(sessionId, body.score, body.notes, sub);
  }

  @Post('rom')
  recordRom(@Req() req:any, @Body() body:{userId:string, joint:string, side:'left'|'right'|'bilateral', angle:number}) {
    const sub = this.subject(req);
    if (sub !== body.userId) throw new ForbiddenException('NOT_OWNER');
    return this.svc.recordRom(sub, body.joint, body.side, body.angle);
  }

  @Get('progress/:userId')
  progress(@Req() req:any, @Param('userId') userId:string, @Query('from') from?:string, @Query('to') to?:string) {
    const sub = this.subject(req);
    if (sub !== userId) throw new ForbiddenException('NOT_OWNER');
    return this.svc.progress(sub, { from, to });
  }

  @Post('seed')
  seed(@Req() req:any, @Body() body:{ protocols: any[] }) {
    // NOTE: Seed left open for dev; protect behind env flag in production
    return this.svc.seedProtocols(body.protocols);
  }
}
