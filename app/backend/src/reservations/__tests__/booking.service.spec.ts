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
  const reservations: any[] = [];
  let seq = 1;

  const matchStatus = (b: any, cond: any) => (cond?.in ? cond.in.includes(b.status) : b.status === cond);

  const mock: any = {
    _slots: slots, _bookings: bookings, _reservations: reservations,
    reservation: {
      count: async ({ where }: any) => reservations.filter((r) => r.resourceId === where.resourceId && r.status !== where.status.not).length,
      findFirst: async ({ where }: any) => reservations.find((r) => r.userId === where.userId && r.status !== where.status.not && r.startsAt < where.startsAt.lt && r.endsAt > where.endsAt.gt) ?? null,
    },
    // Interactive transaction: run the callback against this same mock (the
    // in-memory store has no real rollback, which is fine for these unit tests).
    $transaction: async (arg: any) => (Array.isArray(arg) ? Promise.all(arg) : arg(mock)),
    slot: {
      create: async ({ data }: any) => { const s = { id: seq++, capacity: 1, holdToken: null, holdExpires: null, createdAt: new Date(), ...data }; slots.push(s); return s; },
      findUnique: async ({ where }: any) => slots.find((s) => s.id === where.id) ?? null,
      update: async ({ where, data }: any) => { const s = slots.find((x) => x.id === where.id); Object.assign(s, data); return s; },
      updateMany: async ({ where, data }: any) => {
        const hit = (s: any): boolean => {
          if (where.holdExpires?.lt) return !!s.holdExpires && s.holdExpires < where.holdExpires.lt;
          if (where.holdUserId !== undefined) return s.holdUserId === where.holdUserId && s.id !== where.NOT?.id;
          return s.id === where.id && where.OR.some((c: any) =>
            ('holdExpires' in c && c.holdExpires === null && s.holdExpires == null) ||
            (c.holdExpires?.lte && s.holdExpires != null && s.holdExpires <= c.holdExpires.lte));
        };
        let n = 0;
        for (const s of slots) if (hit(s)) { Object.assign(s, data); n++; }
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
        for (const b of bookings) {
          const hit = where.id !== undefined ? b.id === where.id && b.status === where.status : b.status === where.status && b.createdAt < where.createdAt.lt;
          if (hit) { Object.assign(b, data); n++; }
        }
        return { count: n };
      },
    },
  };
  return mock;
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
    const hold = await svc.holdSlot(10, slot.id);
    expect(hold.token).toBeTruthy();
    await expect(svc.holdSlot(11, slot.id)).rejects.toThrow('HOLD_EXISTS');
    // expire the hold and retry
    prisma._slots[0].holdExpires = new Date(Date.now() - 1000);
    await expect(svc.holdSlot(11, slot.id)).resolves.toHaveProperty('token');
    expect(prisma._slots[0].holdUserId).toBe(11);
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
    await svc.holdSlot(10, slot.id);
    prisma._slots[0].holdExpires = new Date(Date.now() - 1000);
    const b = await svc.createBooking(10, 1, slot.id, 'online');
    prisma._bookings.find((x: any) => x.id === b.id).createdAt = new Date(Date.now() - 31 * 60 * 1000);
    await svc.expireStale();
    expect(prisma._slots[0].holdToken).toBeNull();
    expect(prisma._bookings.find((x: any) => x.id === b.id).status).toBe('CANCELLED');
  });

  // REV-20261106-02: seats are shared with the Reservation table and an active hold blocks other bookers.
  it('counts active Reservation rows against slot capacity, cancelled ones free the seat', async () => {
    const { prisma, svc } = make();
    const slot = await svc.createSlot(1, future(24), future(25), 1);
    prisma._reservations.push({ id: 500, resourceId: slot.id, status: 'ACTIVE' });
    await expect(svc.createBooking(10, 1, slot.id, 'online')).rejects.toThrow('SLOT_FULL');
    prisma._reservations[0].status = 'CANCELED';
    await expect(svc.createBooking(10, 1, slot.id, 'online')).resolves.toMatchObject({ status: 'PENDING' });
  });

  it('an unexpired hold blocks other users, the holder books it and the hold is used up', async () => {
    const { prisma, svc } = make();
    const slot = await svc.createSlot(1, future(24), future(25), 2);
    await svc.holdSlot(10, slot.id);
    await expect(svc.createBooking(11, 1, slot.id, 'online')).rejects.toThrow('SLOT_HELD');
    await expect(svc.createBooking(10, 1, slot.id, 'online')).resolves.toMatchObject({ status: 'PENDING' });
    expect(prisma._slots[0]).toMatchObject({ holdToken: null, holdExpires: null, holdUserId: null });
    await expect(svc.createBooking(11, 1, slot.id, 'online')).resolves.toMatchObject({ status: 'PENDING' });
  });

  it('a user holds at most one slot: a new hold releases the previous one', async () => {
    const { prisma, svc } = make();
    const a = await svc.createSlot(1, future(24), future(25));
    const b = await svc.createSlot(1, future(30), future(31));
    await svc.holdSlot(10, a.id);
    await svc.holdSlot(10, b.id);
    expect(prisma._slots.find((s: any) => s.id === a.id)).toMatchObject({ holdUserId: null, holdExpires: null });
    expect(prisma._slots.find((s: any) => s.id === b.id)).toMatchObject({ holdUserId: 10 });
  });

  it('reschedule rejects a past slot', async () => {
    const { svc } = make();
    const slot = await svc.createSlot(1, future(24), future(25));
    const created = await svc.createBooking(10, 1, slot.id, 'online');
    const past = await svc.createSlot(1, future(-3), future(-2));
    await expect(svc.reschedule(10, created.id, past.id)).rejects.toThrow('SLOT_IN_PAST');
  });

  it('a "could not serialize" driver error at commit is also a 409', async () => {
    const { prisma, svc } = make();
    const slot = await svc.createSlot(1, future(24), future(25));
    prisma.$transaction = async () => { throw new Error('Transaction failed: ERROR: could not serialize access due to read/write dependencies'); };
    await expect(svc.createBooking(10, 1, slot.id, 'online')).rejects.toMatchObject({ status: 409 });
  });

  it('rejects a coachId that does not own the slot and stores the slot owner', async () => {
    const { prisma, svc } = make();
    const slot = await svc.createSlot(7, future(24), future(25));
    await expect(svc.createBooking(10, 8, slot.id, 'online')).rejects.toThrow('COACH_MISMATCH');
    await svc.createBooking(10, 7, slot.id, 'online');
    expect(prisma._bookings[0].coachId).toBe(7);
  });

  it('maps a PostgreSQL serialization abort to a 409 conflict, not a 500', async () => {
    const { prisma, svc } = make();
    const slot = await svc.createSlot(1, future(24), future(25));
    prisma.$transaction = async () => { throw Object.assign(new Error('could not serialize'), { code: 'P2034' }); };
    await expect(svc.createBooking(10, 1, slot.id, 'online')).rejects.toMatchObject({ status: 409 });
  });

  it('a late payment for a cancelled booking is a 409 and never takes a released seat', async () => {
    const { prisma, svc } = make();
    const slot = await svc.createSlot(1, future(24), future(25), 1);
    const a = await svc.createBooking(10, 1, slot.id, 'online');
    await svc.cancelBooking(10, a.id);
    await svc.createBooking(11, 1, slot.id, 'online');
    await expect(svc.confirmPayment(a.id, 'late')).rejects.toMatchObject({ status: 409 });
    expect(prisma._bookings.find((b: any) => b.id === a.id).status).toBe('CANCELLED');
  });

  it('an active hold cannot be renewed, and a failed hold keeps the user\'s previous hold', async () => {
    const { prisma, svc } = make();
    const a = await svc.createSlot(1, future(24), future(25));
    const b = await svc.createSlot(1, future(30), future(31));
    await svc.holdSlot(10, a.id);
    await expect(svc.holdSlot(10, a.id)).rejects.toThrow('HOLD_EXISTS');
    await svc.holdSlot(11, b.id);
    await expect(svc.holdSlot(10, b.id)).rejects.toThrow('HOLD_EXISTS');
    expect(prisma._slots.find((s: any) => s.id === a.id)).toMatchObject({ holdUserId: 10 });
  });

  it('a user with an overlapping active Reservation cannot book', async () => {
    const { prisma, svc } = make();
    const slot = await svc.createSlot(1, future(24), future(26), 3);
    prisma._reservations.push({ id: 600, userId: 10, resourceId: 999, status: 'ACTIVE', startsAt: new Date(future(25)), endsAt: new Date(future(27)) });
    await expect(svc.createBooking(10, 1, slot.id, 'online')).rejects.toThrow('USER_OVERLAP');
    await expect(svc.createBooking(11, 1, slot.id, 'online')).resolves.toMatchObject({ status: 'PENDING' });
  });
});
