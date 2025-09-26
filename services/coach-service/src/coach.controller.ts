import { Body, Controller, Get, Param, Post, Put, Req, ForbiddenException } from '@nestjs/common';
import { CoachService } from './coach.service';
import { subjectFromReq } from '@arman/security-middleware';

@Controller('coach')
export class CoachController {
  constructor(private readonly svc: CoachService){}
  private subject(req:any){ const s = subjectFromReq(req); if(!s) throw new ForbiddenException('AUTH_REQUIRED'); return s; }

  // Templates
  @Post('templates')
  createTemplate(@Req() req:any, @Body() body:{ name:string, content:any }){
    return this.svc.createTemplate(this.subject(req), body.name, body.content);
  }
  @Put('templates/:id')
  updateDraft(@Req() req:any, @Param('id') id:string, @Body() body:{ name?:string, content?:any }){
    return this.svc.updateDraft(this.subject(req), id, body.name, body.content);
  }
  @Post('templates/:id/publish')
  publish(@Req() req:any, @Param('id') id:string){ return this.svc.publish(this.subject(req), id); }
  @Post('templates/:id/assign')
  assign(@Req() req:any, @Param('id') id:string, @Body() body:{ userIds:string[] }){
    return this.svc.assignTemplate(this.subject(req), id, body.userIds||[]);
  }

  // Progress hook
  @Post('progress/record')
  progress(@Body() body:{ userId:string, templateId:string }){ return this.svc.recordProgress(body.userId, body.templateId); }

  // Roster
  @Get('roster')
  roster(@Req() req:any){ return this.svc.roster(this.subject(req)); }

  // Payouts
  @Post('payouts/request')
  request(@Req() req:any, @Body() body:{ amountCents:number, notes?:string }){
    return this.svc.requestPayout(this.subject(req), body.amountCents, body.notes);
  }
  @Get('payouts/mine')
  my(@Req() req:any){ return this.svc.myPayouts(this.subject(req)); }

  // Admin
  @Post('payouts/:id/approve')
  approve(@Param('id') id:string){ return this.svc.approvePayout(id); }
  @Post('payouts/:id/mark-paid')
  paid(@Param('id') id:string){ return this.svc.markPaid(id); }
}
