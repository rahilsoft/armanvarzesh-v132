import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type Geo = { lat:number, lng:number };
type BookingInput = { facilityId:string, doctorId:string, tests:string[], slot:string };
type Hold = { slotId:string, ok:boolean };

function uid(): string { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8); return v.toString(16);
});}

@Injectable()
export class MedicalService {
  private prisma = new PrismaClient();

  async testsCatalog(){
    const tests = await this.prisma.healthTest.findMany({ orderBy: { name: 'asc' } });
    const bundles = await this.prisma.testBundle.findMany({ include: { tests: { include: { test: true } } } });
    return { tests, bundles };
  }

  async nearbyFacilities(geo: Geo, radiusKm: number = 25){
    // naive: return all for now; future: compute distance
    const facilities = await this.prisma.facility.findMany({ include: { doctors: true } });
    return { facilities };
  }

  async myAppointments(userId: string){
    return { items: await this.prisma.appointment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }) };
  }

  private async checkSlotAvailable(slotId: string){
    const slot = await this.prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot) throw new BadRequestException('SLOT_NOT_FOUND');
    const used = await this.prisma.appointment.count({ where: { slotId, status: { in: ['pending','confirmed'] } } });
    if (used >= slot.capacity) throw new BadRequestException('SLOT_FULL');
    return slot;
  }

  async bookAppointment(userId: string, facilityId: string, doctorId: string, tests: string[], slotId: string){
    const slot = await this.checkSlotAvailable(slotId);
    const fasting = await this.requiresFasting(tests);
    const apptId = uid();
    await this.prisma.appointment.create({ data: { id: apptId, userId, facilityId, doctorId, slotId, status: 'pending', fasting } });
    // in real world: emit PAYMENT_REQUIRED, on success -> confirm
    return { id: apptId, fasting, ics: this.buildICS(apptId, slot.startUTC, slot.endUTC) };
  }

  async cancelAppointment(userId: string, id: string){
    const a = await this.prisma.appointment.findUnique({ where: { id } });
    if (!a || a.userId !== userId) throw new BadRequestException('NOT_FOUND_OR_FORBIDDEN');
    if (a.status === 'cancelled') return a;
    return this.prisma.appointment.update({ where: { id }, data: { status: 'cancelled' } });
  }

  async reschedule(userId: string, id: string, newSlotId: string){
    const a = await this.prisma.appointment.findUnique({ where: { id } });
    if (!a || a.userId !== userId) throw new BadRequestException('NOT_FOUND_OR_FORBIDDEN');
    await this.checkSlotAvailable(newSlotId);
    return this.prisma.appointment.update({ where: { id }, data: { slotId: newSlotId } });
  }

  async myMedicalSummary(userId: string){
    const recent = await this.prisma.appointment.findMany({ where: { userId, status: 'confirmed' }, orderBy: { createdAt: 'desc' }, take: 10, include: { result: true } });
    const fastingUpcoming = await this.prisma.appointment.findMany({ where: { userId, status: { in: ['pending','confirmed'] }, /* filter by time window later */ } });
    return { recent, fastingUpcoming: fastingUpcoming.filter(a=>a.fasting) };
  }

  async onResultsReady(appointmentId: string, summary: string){
    // webhook handler: assumes lab posts back
    const id = uid();
    await this.prisma.result.create({ data: { id, summary } });
    await this.prisma.appointment.update({ where: { id: appointmentId }, data: { resultId: id, status: 'confirmed' } });
    // TODO: emit NOTIFY user via notifications-service
    return { ok: true };
  }

  private async requiresFasting(testIds: string[]): Promise<boolean>{
    if (!testIds?.length) return false;
    const tests = await this.prisma.healthTest.findMany({ where: { id: { in: testIds } } });
    return tests.some(t => t.requiresFasting);
  }

  private buildICS(apptId: string, start: Date, end: Date){
    const dt = (d:Date)=> d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
    const body = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ArmanVarzesh//Medical//EN',
      'BEGIN:VEVENT',
      `UID:${apptId}`,
      `DTSTAMP:${dt(new Date())}`,
      `DTSTART:${dt(new Date(start))}`,
      `DTEND:${dt(new Date(end))}`,
      'SUMMARY:Medical Appointment',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    return body;
  }
}
