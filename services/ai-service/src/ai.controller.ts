import { Body, Controller, Get, Post, Query, Req, ForbiddenException } from '@nestjs/common';
import { AiService } from './ai.service';
import { subjectFromReq } from '@arman/security-middleware';

@Controller('ai')
export class AiController {
  constructor(private readonly svc: AiService){}
  private subject(req:any){ const s = subjectFromReq(req); if(!s) throw new ForbiddenException('AUTH_REQUIRED'); return s; }

  @Post('suggest-next-set')
  suggest(@Req() req:any, @Body() body:{ lastSets:{exerciseId:string, weight:number, reps:number, rpe?:number}[], fatigue?:number, hr?:number, seed?:number }){
    return this.svc.suggestNextSet({ userId: this.subject(req), ...body });
  }

  @Get('readiness')
  readiness(@Req() req:any, @Query('hrv') hrv?:string, @Query('sleepHours') sleep?:string, @Query('load') load?:string, @Query('soreness') sore?:string){
    return this.svc.readiness(this.subject(req), { hrv: hrv? Number(hrv): undefined, sleepHours: sleep? Number(sleep): undefined, load: load? Number(load): undefined, soreness: sore? Number(sore): undefined });
  }

  @Post('coach-match')
  match(@Body() body:{ userFeatures:any }){
    return this.svc.coachMatch(body.userFeatures);
  }
}
