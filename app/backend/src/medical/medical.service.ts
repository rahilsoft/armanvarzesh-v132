import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Appointment, ClinicSlot, Facility, Doctor, HealthTest } from '@prisma/client';

/**
 * Clinical appointments — facilities, doctors, health-test catalog, capacity-
 * checked booking with fasting detection and ICS calendar output. Folded from
 * services/medical-service (String ids -> core Int PKs; injected PrismaService
 * replaces its private `new PrismaClient()`). The service's `Slot` became
 * `ClinicSlot`: clinical scheduling is a separate bounded context from the
 * coach-booking `Slot`. The lab results-ready webhook now also emits a
 * MEDICAL_RESULTS_READY outbox event (the original had a TODO to notify).
 */

export interface BookingResult {
  id: number;
  fasting: boolean;
  ics: string;
}

@Injectable()
export class MedicalService {
  constructor(private readonly prisma: PrismaService) {}

  async testsCatalog(): Promise<{ tests: HealthTest[]; bundles: unknown[] }> {
    const tests = await this.prisma.healthTest.findMany({ orderBy: { name: 'asc' } });
    const bundles = await this.prisma.testBundle.findMany({ include: { tests: { include: { test: true } } } });
    return { tests, bundles };
  }

  /** Naive for now (returns all facilities with doctors); distance filtering
   *  arrives with geo-indexing. Signature kept from the former service. */
  async nearbyFacilities(_geo: { lat: number; lng: number }, _radiusKm = 25): Promise<{ facilities: (Facility & { doctors: Doctor[] })[] }> {
    const facilities = await this.prisma.facility.findMany({ include: { doctors: true } });
    return { facilities };
  }

  async myAppointments(userId: number): Promise<{ items: Appointment[] }> {
    return { items: await this.prisma.appointment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }) };
  }

  private async checkSlotAvailable(clinicSlotId: number): Promise<ClinicSlot> {
    const slot = await this.prisma.clinicSlot.findUnique({ where: { id: clinicSlotId } });
    if (!slot) throw new BadRequestException('SLOT_NOT_FOUND');
    const used = await this.prisma.appointment.count({
      where: { clinicSlotId, status: { in: ['pending', 'confirmed'] } },
    });
    if (used >= slot.capacity) throw new BadRequestException('SLOT_FULL');
    return slot;
  }

  async bookAppointment(userId: number, facilityId: number, doctorId: number, testIds: number[], clinicSlotId: number): Promise<BookingResult> {
    const slot = await this.checkSlotAvailable(clinicSlotId);
    const fasting = await this.requiresFasting(testIds);
    const appt = await this.prisma.appointment.create({
      data: { userId, facilityId, doctorId, clinicSlotId, status: 'pending', fasting },
    });
    return { id: appt.id, fasting, ics: this.buildICS(appt.id, slot.startUTC, slot.endUTC) };
  }

  async cancelAppointment(userId: number, id: number): Promise<Appointment> {
    const a = await this.prisma.appointment.findUnique({ where: { id } });
    if (!a || a.userId !== userId) throw new BadRequestException('NOT_FOUND_OR_FORBIDDEN');
    if (a.status === 'cancelled') return a;
    return this.prisma.appointment.update({ where: { id }, data: { status: 'cancelled' } });
  }

  async reschedule(userId: number, id: number, newClinicSlotId: number): Promise<Appointment> {
    const a = await this.prisma.appointment.findUnique({ where: { id } });
    if (!a || a.userId !== userId) throw new BadRequestException('NOT_FOUND_OR_FORBIDDEN');
    await this.checkSlotAvailable(newClinicSlotId);
    return this.prisma.appointment.update({ where: { id }, data: { clinicSlotId: newClinicSlotId } });
  }

  async myMedicalSummary(userId: number): Promise<{ recent: Appointment[]; fastingUpcoming: Appointment[] }> {
    const recent = await this.prisma.appointment.findMany({
      where: { userId, status: 'confirmed' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { result: true },
    });
    const active = await this.prisma.appointment.findMany({
      where: { userId, status: { in: ['pending', 'confirmed'] }, fasting: true },
    });
    return { recent, fastingUpcoming: active };
  }

  /** Lab webhook: attach the result, confirm the appointment, notify via outbox. */
  async onResultsReady(appointmentId: number, summary: string): Promise<{ ok: true }> {
    const appt = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appt) throw new BadRequestException('APPOINTMENT_NOT_FOUND');
    const result = await this.prisma.result.create({ data: { summary } });
    await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { resultId: result.id, status: 'confirmed' },
    });
    await this.prisma.domainEventOutbox.create({
      data: { type: 'MEDICAL_RESULTS_READY', data: { appointmentId, userId: appt.userId, resultId: result.id } },
    });
    return { ok: true };
  }

  private async requiresFasting(testIds: number[]): Promise<boolean> {
    if (!testIds?.length) return false;
    const tests = await this.prisma.healthTest.findMany({ where: { id: { in: testIds } } });
    return tests.some((t) => t.requiresFasting);
  }

  private buildICS(apptId: number, start: Date, end: Date): string {
    const dt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ArmanVarzesh//Medical//EN',
      'BEGIN:VEVENT',
      `UID:appt-${apptId}`,
      `DTSTAMP:${dt(new Date())}`,
      `DTSTART:${dt(start)}`,
      `DTEND:${dt(end)}`,
      'SUMMARY:Medical Appointment',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  }
}
