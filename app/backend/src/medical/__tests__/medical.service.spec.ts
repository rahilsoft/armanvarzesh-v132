import { BadRequestException } from '@nestjs/common';
import { MedicalService } from '../medical.service';

/**
 * Medical domain fold: verifies capacity-checked booking, fasting detection,
 * ICS output, authorization on cancel/reschedule and the results-ready
 * webhook (result linked + appointment confirmed + outbox event). Prisma is
 * an in-memory mock; integration/E2E against real Postgres run in CI.
 */
function makePrismaMock() {
  const slots: any[] = [];
  const tests: any[] = [];
  const appts: any[] = [];
  const results: any[] = [];
  const outbox: any[] = [];
  let seq = 1;
  return {
    _slots: slots, _tests: tests, _appts: appts, _results: results, _outbox: outbox,
    clinicSlot: {
      findUnique: async ({ where }: any) => slots.find((s) => s.id === where.id) ?? null,
    },
    healthTest: {
      findMany: async ({ where }: any = {}) =>
        where?.id?.in ? tests.filter((t) => where.id.in.includes(t.id)) : tests,
    },
    testBundle: { findMany: async () => [] },
    facility: { findMany: async () => [] },
    appointment: {
      create: async ({ data }: any) => { const a = { id: seq++, createdAt: new Date(), resultId: null, ...data }; appts.push(a); return a; },
      findUnique: async ({ where }: any) => appts.find((a) => a.id === where.id) ?? null,
      findMany: async ({ where }: any) => appts.filter((a) =>
        a.userId === where.userId
        && (where.status === undefined || (where.status.in ? where.status.in.includes(a.status) : a.status === where.status))
        && (where.fasting === undefined || a.fasting === where.fasting)),
      update: async ({ where, data }: any) => { const a = appts.find((x) => x.id === where.id); Object.assign(a, data); return a; },
      count: async ({ where }: any) => appts.filter((a) => a.clinicSlotId === where.clinicSlotId && where.status.in.includes(a.status)).length,
    },
    result: { create: async ({ data }: any) => { const r = { id: seq++, ...data }; results.push(r); return r; } },
    domainEventOutbox: { create: async ({ data }: any) => { const e = { id: seq++, ...data }; outbox.push(e); return e; } },
  };
}

const hour = 3_600_000;

function seed(prisma: any) {
  prisma._slots.push({ id: 501, doctorId: 1, startUTC: new Date(Date.now() + 24 * hour), endUTC: new Date(Date.now() + 25 * hour), capacity: 1 });
  prisma._slots.push({ id: 502, doctorId: 1, startUTC: new Date(Date.now() + 30 * hour), endUTC: new Date(Date.now() + 31 * hour), capacity: 2 });
  prisma._tests.push({ id: 601, name: 'CBC', code: 'cbc', requiresFasting: false });
  prisma._tests.push({ id: 602, name: 'Glucose', code: 'glu', requiresFasting: true });
}

describe('MedicalService (Medical domain fold)', () => {
  it('books with fasting detection and returns a valid ICS', async () => {
    const prisma = makePrismaMock(); seed(prisma);
    const svc = new MedicalService(prisma as any);
    const res = await svc.bookAppointment(9, 1, 1, [601, 602], 501);
    expect(res.fasting).toBe(true); // glucose requires fasting
    expect(res.ics).toContain('BEGIN:VCALENDAR');
    expect(res.ics).toContain(`UID:appt-${res.id}`);
    const noFast = await svc.bookAppointment(9, 1, 1, [601], 502);
    expect(noFast.fasting).toBe(false);
  });

  it('enforces clinic-slot capacity', async () => {
    const prisma = makePrismaMock(); seed(prisma);
    const svc = new MedicalService(prisma as any);
    await svc.bookAppointment(1, 1, 1, [], 501); // capacity 1
    await expect(svc.bookAppointment(2, 1, 1, [], 501)).rejects.toThrow('SLOT_FULL');
    await expect(svc.bookAppointment(2, 1, 1, [], 999)).rejects.toThrow('SLOT_NOT_FOUND');
  });

  it('cancel/reschedule are owner-only; cancel is idempotent', async () => {
    const prisma = makePrismaMock(); seed(prisma);
    const svc = new MedicalService(prisma as any);
    const appt = await svc.bookAppointment(5, 1, 1, [], 501);
    await expect(svc.cancelAppointment(6, appt.id)).rejects.toBeInstanceOf(BadRequestException);
    const cancelled = await svc.cancelAppointment(5, appt.id);
    expect(cancelled.status).toBe('cancelled');
    expect((await svc.cancelAppointment(5, appt.id)).status).toBe('cancelled'); // idempotent
    const b = await svc.bookAppointment(5, 1, 1, [], 502);
    await expect(svc.reschedule(7, b.id, 502)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('results-ready webhook links the result, confirms, and emits the outbox event', async () => {
    const prisma = makePrismaMock(); seed(prisma);
    const svc = new MedicalService(prisma as any);
    const appt = await svc.bookAppointment(3, 1, 1, [], 501);
    await svc.onResultsReady(appt.id, 'All markers normal');
    const stored = prisma._appts.find((a: any) => a.id === appt.id);
    expect(stored.status).toBe('confirmed');
    expect(stored.resultId).toBe(prisma._results[0].id);
    expect(prisma._outbox[0]).toMatchObject({ data: { appointmentId: appt.id, userId: 3 } });
    await expect(svc.onResultsReady(9999, 'x')).rejects.toThrow('APPOINTMENT_NOT_FOUND');
  });

  it('summary returns recent confirmed and fasting-only upcoming', async () => {
    const prisma = makePrismaMock(); seed(prisma);
    const svc = new MedicalService(prisma as any);
    const a1 = await svc.bookAppointment(4, 1, 1, [602], 502); // fasting
    await svc.bookAppointment(4, 1, 1, [601], 502);            // not fasting
    await svc.onResultsReady(a1.id, 'ok');
    const sum = await svc.myMedicalSummary(4);
    expect(sum.fastingUpcoming).toHaveLength(1);
    expect(sum.fastingUpcoming[0].id).toBe(a1.id);
  });
});
