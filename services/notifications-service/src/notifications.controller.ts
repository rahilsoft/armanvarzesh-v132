import { Body, Controller, Get, Post, Query, Req, ForbiddenException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { subjectFromReq } from '@arman/security-middleware';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService){}
  private subject(req:any){ const s = subjectFromReq(req); if(!s) throw new ForbiddenException('AUTH_REQUIRED'); return s; }

  @Post('schedule')
  schedule(@Req() req:any, @Body() body:{ templateKey:string, data:any, sendAt:string, channels:string[], locale?:string, tz?:string }){
    const sub = this.subject(req);
    return this.svc.schedule(sub, body.templateKey, body.data, body.sendAt, body.channels, body.locale, body.tz);
  }

  @Post('preview')
  preview(@Body() body:{ templateKey:string, data:any, locale?:string }){
    return this.svc.preview(body.templateKey, body.data, body.locale);
  }

  @Post('cron/process')
  process(){ return this.svc.processDue(); }

  @Get('outbox')
  outbox(@Query('limit') limit?:string){ return this.svc.listOutbox(limit? Number(limit):50); }
}
