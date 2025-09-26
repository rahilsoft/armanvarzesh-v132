import { Body, Controller, Get, Param, Post, Query, Req, ForbiddenException } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { subjectFromReq } from '@arman/security-middleware';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly svc: AssessmentsService){}

  private subject(req:any){ const s = subjectFromReq(req); if(!s) throw new ForbiddenException('AUTH_REQUIRED'); return s; }

  @Get() list(){ return this.svc.list(); }

  @Get('mine') my(@Req() req:any, @Query('status') status?:string){
    const sub = this.subject(req);
    return this.svc.myAssessments(sub, status);
  }

  @Get(':id') get(@Param('id') id:string){ return this.svc.getAssessment(id); }

  @Post(':id/start') start(@Param('id') id:string){ return this.svc.startAssessment(id); }

  @Post(':id/submit')
  submit(@Req() req:any, @Param('id') id:string, @Body() body:{ answers: {questionId:string, value:any}[] }){
    const sub = this.subject(req);
    return this.svc.submitAssessment({ userId: sub, assessmentId: id, answers: body.answers||[] });
  }

  @Get('result/:attemptId') result(@Req() req:any, @Param('attemptId') attemptId:string){
    const sub = this.subject(req); // NOTE: could also verify attempt ownership
    return this.svc.assessmentResult(attemptId);
  }
}
