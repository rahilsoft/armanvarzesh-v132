import { Body, Controller, Get, Post, Query, Req, ForbiddenException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { subjectFromReq } from '@arman/security-middleware';

@Controller('booking')
export class BookingController {
  constructor(private readonly svc: BookingService){}
  private subject(req:any){ const s = subjectFromReq(req); if(!s) throw new ForbiddenException('AUTH_REQUIRED'); return s; }

  // Coach APIs
  @Post('slots/create')
  createSlot(@Req() req:any, @Body() body:{ startUTC:string, endUTC:string, capacity?:number }){
    const coachId = this.subject(req);
    return this.svc.createSlot(coachId, body.startUTC, body.endUTC, body.capacity||1);
  }

  // User APIs
  @Post('create')
  create(@Req() req:any, @Body() body:{ coachId:string, slotId:string, mode:string }){
    const sub = this.subject(req);
    return this.svc.createBooking(sub, body.coachId, body.slotId, body.mode);
  }

  @Post('cancel')
  cancel(@Req() req:any, @Body() body:{ id:string }){
    const sub = this.subject(req);
    return this.svc.cancelBooking(sub, body.id);
  }

  @Post('reschedule')
  reschedule(@Req() req:any, @Body() body:{ id:string, newSlotId:string }){
    const sub = this.subject(req);
    return this.svc.reschedule(sub, body.id, body.newSlotId);
  }

  @Post('hold')
  hold(@Body() body:{ slotId:string }){ return this.svc.holdSlot(body.slotId); }

  // Payments webhook
  @Post('payments/success')
  paySuccess(@Body() body:{ bookingId:string, paymentId:string }){ return this.svc.confirmPayment(body.bookingId, body.paymentId); }

  // List my bookings
  @Get('mine')
  mine(@Req() req:any){ return this.svc.listMy(this.subject(req)); }

  // Cron hook
  @Post('cron/expire')
  expire(){ return this.svc.expireStale(); }
}
