import { BadRequestException } from '@nestjs/common';
import { BookingService } from '../booking.service';

/**
 * Booking domain fold: verifies slots/holds/capacity/overlap/payment-confirm
 * behaviour ported from services/booking-service. Prisma is an in-memory
 * mock; integration/E2E against real Postgres run in CI.
 */
function makePrismaMock() {
  const slots: any[] = [];
  const bookings: any[] = [];
  let seq = 1;

  const matchStatus = (b: any, cond: any) => (cond?.in ? cond.in.includes(b.status) : b.status === cond);

  return {
    _slots: slots, _bookings: bookings,
    slot: {
      create: async ({ data }: any) => { const s = { id: seq++, capacity: 1, holdToken: null, holdExpires: null, createdAt: new Date(), ...data }; slots.push(s); return s; },
      findUnique: async ({ where }: any) => slots.find((s) => s.id === where.id) ?? null,
      update: async ({ where, data }: any) => { const s = slots.find((x) => x.id === where.id); Object.assign(s, data); return s; },
      updateMany: async ({ where, data }: any) => {
        let n = 0;
        for (const s of slots) if (s.holdExpires && s.holdExpires < where.holdExpires.lt) { Object.assign(s, data); n++; }
        return { count: n };
      },
    },
    booking: {
      create: async ({ data }: any) => { const b = { id: seq++, paymentRef: null, createdAt: new Date(), ...data }; bookings.push(b); return b; },
      findUnique: async ({ where }: any) => bookings.find((b) => b.id === where.id) ?? null,
      update: async ({ where, data }: any) => { const b = bookings.find((x) => x.id === where.id); Object.assign(b, data); return b; },
      count: async ({ where }: any) => bookings.filter((b) => b.slotId === where.slotId && matchStatus(b, where.status)).length,
      findMany: async ({ where, include }: any) => bookings
        .filter((b) => b.userId === where.userId && matchStatus(b, where.status) && (!where.NOT || b.id !== where.NOT.id))
        .map((b) => (include?.slot ? { ...b, slot: slots.find((s) => s.id === b.slotId) } : b)),
      updateMany: async ({ where, data }: any) => {
        let n = 0;
        for (const b of bookings) if (b.status === where.status && b.createdAt < where.createdAt.lt) { Object.assign(b, data); n++; }
        return { count: n };
      },
    },
  };
}

const hour = 60 * 60 * 1000;
const future = (h: number) => new Date(Date.now() + h * hour).toISOString();

function make() {
  const prisma = makePrismaMock();
  const svc = new BookingService(prisma as any);
  return { prisma, svc };
}

describe('BookingService (Booking domain fold)', () => {
  it('creates a slot and books it (PENDING with a payment checkout handle)', async () => {
    const { svc } = make();
    const slot = await svc.createSlot(1, future(24), future(25));
    const res = await svc.createBooking(10, 1, slot.id, 'online');
    expect(res.status).toBe('PENDING');
    expect(res.paymentCheckoutUrl).toContain(String(res.id));
  });

  it('rejects an invalid range and a slot in the past', async () => {
    const { svc } = make();
    await expect(svc.createSlot(1, future(25), future(24))).rejects.toBeInstanceOf(BadRequestException);
    const past = await svc.createSlot(1, future(-3), future(-2));
    await expect(svc.createBooking(10, 1, past.id, 'online')).rejects.toThrow('SLOT_IN_PAST');
  });

  it('enforces slot capacity', async () => {
    const { svc } = make();
    const slot = await svc.createSlot(1, future(24), future(25), 1);
    await svc.createBooking(10, 1, slot.id, 'online');
    await expect(svc.createBooking(11, 1, slot.id, 'online')).rejects.toThrow('SLOT_FULL');
  });

  it('rejects a user double-booking overlapping times (across different slots)', async () => {
    const { svc } = make();
    const a = await svc.createSlot(1, future(24), future(26));
    const b = await svc.createSlot(2, future(25), future(27)); // overlaps a
    await svc.createBooking(10, 1, a.id, 'online');
    await expect(svc.createBooking(10, 2, b.id, 'online')).rejects.toThrow('USER_OVERLAP');
    // non-overlapping is fine
    const c = await svc.createSlot(2, future(30), future(31));
    await expect(svc.createBooking(10, 2, c.id, 'online')).resolves.toMatchObject({ status: 'PENDING' });
  });

  it('holds a slot once until the hold expires', async () => {
    const { prisma, svc } = make();
    const slot = await svc.createSlot(1, future(24), future(25));
    const hold = await svc.holdSlot(slot.id);
    expect(hold.token).toBeTruthy();
    await expect(svc.holdSlot(slot.id)).rejects.toThrow('HOLD_EXISTS');
    // expire the hold and retry
    prisma._slots[0].holdExpires = new Date(Date.now() - 1000);
    await expect(svc.holdSlot(slot.id)).resolves.toHaveProperty('token');
  });

  it('confirms payment idempotently and reschedule respects capacity', async () => {
    const { svc } = make();
    const slot = await svc.createSlot(1, future(24), future(25));
    const created = await svc.createBooking(10, 1, slot.id, 'online');
    const confirmed = await svc.confirmPayment(created.id, 'pay-9');
    expect(confirmed.status).toBe('CONFIRMED');
    expect(confirmed.paymentRef).toBe('pay-9');
    const again = await svc.confirmPayment(created.id, 'pay-ignored');
    expect(again.paymentRef).toBe('pay-9'); // idempotent — not overwritten

    const fullSlot = await svc.createSlot(2, future(30), future(31), 1);
    await svc.createBooking(11, 2, fullSlot.id, 'online');
    await expect(svc.reschedule(10, created.id, fullSlot.id)).rejects.toThrow('SLOT_FULL');
  });

  it('expireStale clears dead holds and cancels stale PENDING bookings', async () => {
    const { prisma, svc } = make();
    const slot = await svc.createSlot(1, future(24), future(25), 5);
    await svc.holdSlot(slot.id);
    prisma._slots[0].holdExpires = new Date(Date.now() - 1000);
    const b = await svc.createBooking(10, 1, slot.id, 'online');
    prisma._bookings.find((x: any) => x.id === b.id).createdAt = new Date(Date.now() - 31 * 60 * 1000);
    await svc.expireStale();
    expect(prisma._slots[0].holdToken).toBeNull();
    expect(prisma._bookings.find((x: any) => x.id === b.id).status).toBe('CANCELLED');
  });
});
