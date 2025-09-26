import { Body, Controller, Get, Post, Query, Req, ForbiddenException } from '@nestjs/common';
import { MedicalService } from './medical.service';
import { subjectFromReq } from '@arman/security-middleware';

@Controller()
export class MedicalController {
  constructor(private readonly svc: MedicalService){}

  private subject(req:any){ const s = subjectFromReq(req); if(!s) throw new ForbiddenException('AUTH_REQUIRED'); return s; }

  @Get('/medical/testsCatalog')
  catalog(){ return this.svc.testsCatalog(); }

  @Get('/medical/nearbyFacilities')
  nearby(@Query('lat') lat?:string, @Query('lng') lng?:string, @Query('radius') radius?:string){
    const g = { lat: Number(lat||0), lng: Number(lng||0) };
    return this.svc.nearbyFacilities(g, Number(radius||25));
  }

  @Get('/medical/myAppointments')
  mine(@Req() req:any){ return this.svc.myAppointments(this.subject(req)); }

  @Post('/medical/bookAppointment')
  book(@Req() req:any, @Body() body:{ facilityId:string, doctorId:string, tests:string[], slot:string }){
    const sub = this.subject(req);
    return this.svc.bookAppointment(sub, body.facilityId, body.doctorId, body.tests, body.slot);
  }

  @Post('/medical/cancelAppointment')
  cancel(@Req() req:any, @Body() body:{ id:string }){
    const sub = this.subject(req);
    return this.svc.cancelAppointment(sub, body.id);
  }

  @Post('/medical/reschedule')
  reschedule(@Req() req:any, @Body() body:{ id:string, newSlot:string }){
    const sub = this.subject(req);
    return this.svc.reschedule(sub, body.id, body.newSlot);
  }

  // Webhook: RESULTS_READY (lab → our system)
  @Post('/medical/webhooks/results-ready')
  results(@Body() body:{ appointmentId:string, summary:string }){
    return this.svc.onResultsReady(body.appointmentId, body.summary);
  }
}
