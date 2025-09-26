import { Body, Controller, Get, Post, Query, Req, ForbiddenException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { subjectFromReq } from '@arman/security-middleware';

@Controller()
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService){}
  private subject(req:any){ const s = subjectFromReq(req); if(!s) throw new ForbiddenException('AUTH_REQUIRED'); return s; }

  // Ingest
  @Post('/analytics/track')
  track(@Req() req:any, @Body() body:{ eventName:string, props?:any, ts?:string, idempotencyKey:string }){
    const sub = this.subject(req);
    return this.svc.track({ userId: sub, eventName: body.eventName, props: body.props, ts: body.ts, idempotencyKey: body.idempotencyKey });
  }

  // KPIs on the fly
  @Get('/kpis')
  kpis(@Query('from') from?:string, @Query('to') to?:string){ return this.svc.kpisRange(from, to); }

  // Rollup cron (daily)
  @Post('/kpis/cron/rollup')
  rollup(@Query('from') from?:string, @Query('to') to?:string){ return this.svc.rollup(from, to); }

  // CSV export
  @Get('/kpis/export.csv')
  async export(@Query('from') from?:string, @Query('to') to?:string){
    const csv = await this.svc.exportCsv(from, to);
    return csv;
  }
}
