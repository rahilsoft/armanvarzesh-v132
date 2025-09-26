import { Body, Controller, Get, Param, Post, Req, ForbiddenException } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { subjectFromReq } from '@arman/security-middleware';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly svc: ActivitiesService){}
  private subject(req:any){ const s = subjectFromReq(req); if(!s) throw new ForbiddenException('AUTH_REQUIRED'); return s; }

  @Post('routes/create')
  createRoute(@Req() req:any, @Body() body:{ name:string, polyline:string, difficulty?:string, city?:string }){
    const sub = this.subject(req);
    return this.svc.createRoute(sub, body.name, body.polyline, body.difficulty, body.city);
  }

  @Post('start')
  start(@Req() req:any, @Body() body:{ routeId?:string }){
    const sub = this.subject(req);
    return this.svc.startActivity(sub, body.routeId);
  }

  @Post(':id/tick')
  tick(@Param('id') id:string, @Body() body:{ ts?:string, lat:number, lng:number, elevM?:number, paused?:boolean }){
    return this.svc.tick(id, body);
  }

  @Post(':id/end')
  end(@Req() req:any, @Param('id') id:string){
    const sub = this.subject(req);
    return this.svc.endActivity(sub, id);
  }

  @Post(':id/invite')
  invite(@Req() req:any, @Param('id') id:string, @Body() body:{ userIds:string[] }){
    const sub = this.subject(req);
    return this.svc.inviteFriends(id, sub, body.userIds||[]);
  }

  @Get(':id')
  get(@Param('id') id:string){ return this.svc.getActivity(id); }
}
