import { randomUUID } from 'crypto';
import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Booking, Slot, Prisma } from '@prisma/client';
import { createCanonicalSlot } from './slot-store';

/**
 * Coach-slot booking with holds, capacity and user-overlap protection —
 * folded from services/booking-service into the modular monolith (core Int
 * PKs; the service's hand-rolled pseudo-uuid replaced by crypto.randomUUID
 * for hold tokens; its per-booking slot-lookup loops replaced with single
 * queries including the slot). Payment checkout integration goes through the
 * Payments domain (see confirmPayment; the outbox event
 * BOOKING_PAYMENT_SUCCEEDED emitted by CheckoutService is the producing
 * side — an outbox relay delivers it here).
 */

const ACTIVE = ['PENDING', 'CONFIRMED'];

/**
 * Seats of a Slot are shared by two entry points: Booking (REST /booking) and
 * Reservation (REST /reservations and GraphQL bookReservation). Both write
 * paths call this inside a Serializable transaction, so the capacity check
 * sees the other table and PostgreSQL aborts one of two racing writers
 * (REV-20261106-02).
 */
export async function countActiveSeats(tx: Prisma.TransactionClient, slotId: number): Promise<number> {
  const [bookings, reservations] = await Promise.all([
    tx.booking.count({ where: { slotId, status: { in: ACTIVE } } }),
    tx.reservation.count({ where: { resourceId: slotId, status: { not: 'CANCELED' } } }),
  ]);
  return bookings + reservations;
}

/** An unexpired hold on the slot blocks every user except the one who placed it. */
export function isHeldByOther(slot: Pick<Slot, 'holdExpires' | 'holdUserId'>, userId: number, now = Date.now()): boolean {
  return !!slot.holdExpires && slot.holdExpires.getTime() > now && slot.holdUserId !== userId;
}

/**
 * True when `userId` already holds an active Reservation overlapping the
 * slot's time. Booking-vs-Booking overlap is checked by BookingService;
 * this covers the other table so a user cannot hold two overlapping seats
 * through the two entry points.
 */
export async function hasOverlappingReservation(tx: Prisma.TransactionClient, userId: number, slot: Pick<Slot, 'startUTC' | 'endUTC'>): Promise<boolean> {
  const r = await tx.reservation.findFirst({
    where: { userId, status: { not: 'CANCELED' }, startsAt: { lt: slot.endUTC }, endsAt: { gt: slot.startUTC } },
  });
  return !!r;
}

/** True when `userId` already holds an active Booking overlapping the slot's time. */
export async function hasOverlappingBooking(tx: Prisma.TransactionClient, userId: number, slot: Pick<Slot, 'startUTC' | 'endUTC'>, excludeBookingId?: number): Promise<boolean> {
  const b = await tx.booking.findFirst({
    where: {
      userId,
      status: { in: ACTIVE },
      slot: { startUTC: { lt: slot.endUTC }, endUTC: { gt: slot.startUTC } },
      ...(excludeBookingId ? { NOT: { id: excludeBookingId } } : {}),
    },
  });
  return !!b;
}

/** PostgreSQL serialization failure surfaced by Prisma for a losing Serializable transaction. */
export function isSerializationFailure(e: unknown): boolean {
  const err = e as { code?: string; meta?: { code?: string } };
  // Prisma 5 reports the abort as P2034, or, when PostgreSQL raises it at
  // COMMIT of an interactive transaction, only through the driver message.
  return err?.code === 'P2034' || err?.meta?.code === '40001' || /could not serialize access/i.test(String((e as Error)?.message ?? ''));
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export interface BookingCreated {
  id: number;
  status: 'PENDING';
  paymentCheckoutUrl: string;
  expiresAt: string;
}

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  readonly HOLD_TTL_MS = 10 * 60 * 1000; // 10 minutes
  readonly PAYMENT_TTL_MS = 30 * 60 * 1000; // 30 minutes

  async createSlot(coachId: number, startUTC: string, endUTC: string, capacity = 1): Promise<Slot> {
    return createCanonicalSlot(this.prisma, { coachId, start: new Date(startUTC), end: new Date(endUTC), capacity });
  }

  async createBooking(userId: number, coachId: number, slotId: number, mode: string): Promise<BookingCreated> {
    // Capacity/overlap check and the booking insert run in one serializable
    // transaction so two concurrent requests cannot both pass the capacity
    // check and overbook the slot. Capacity counts Reservation rows too.
    let booking: Booking;
    try {
      booking = await this.prisma.$transaction(async (tx) => {
        const slot = await tx.slot.findUnique({ where: { id: slotId } });
        if (!slot) throw new BadRequestException('SLOT_NOT_FOUND');
        // The coach is the owner of the slot, never the client's claim.
        if (slot.coachId !== coachId) throw new BadRequestException('COACH_MISMATCH');
        if (slot.endUTC.getTime() <= Date.now()) throw new BadRequestException('SLOT_IN_PAST');
        if (isHeldByOther(slot, userId)) throw new BadRequestException('SLOT_HELD');

        // Release the slot's hold: a stale one, or the booker's own (it is used up).
        if (slot.holdExpires) {
          await tx.slot.update({ where: { id: slotId }, data: { holdToken: null, holdExpires: null, holdUserId: null } });
        }

        const activeCount = await countActiveSeats(tx, slotId);
        if (activeCount >= slot.capacity) throw new BadRequestException('SLOT_FULL');

        await this.assertNoUserOverlap(tx, userId, slot);

        return tx.booking.create({ data: { userId, coachId: slot.coachId, slotId, status: 'PENDING', mode } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (e) {
      if (isSerializationFailure(e)) throw new ConflictException('SLOT_BUSY');
      throw e;
    }

    // Payment checkout is created by the Payments domain; URL shape kept from
    // the former service until PAYMENTS-WIRE exposes the live checkout route.
    return {
      id: booking.id,
      status: 'PENDING',
      paymentCheckoutUrl: `https://payments.example/checkout?booking=${booking.id}`,
      expiresAt: new Date(Date.now() + this.PAYMENT_TTL_MS).toISOString(),
    };
  }

  async cancelBooking(userId: number, id: number): Promise<Booking> {
    const b = await this.prisma.booking.findUnique({ where: { id } });
    if (!b || b.userId !== userId) throw new BadRequestException('NOT_FOUND_OR_FORBIDDEN');
    if (b.status === 'CANCELLED') return b;
    return this.prisma.booking.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  async reschedule(userId: number, id: number, newSlotId: number): Promise<Booking> {
    // Same check-then-write race as createBooking: capacity/overlap check and
    // the move are atomic under a serializable transaction.
    try {
      return await this.prisma.$transaction(async (tx) => {
        const b = await tx.booking.findUnique({ where: { id } });
        if (!b || b.userId !== userId) throw new BadRequestException('NOT_FOUND_OR_FORBIDDEN');
        const newSlot = await tx.slot.findUnique({ where: { id: newSlotId } });
        if (!newSlot) throw new BadRequestException('SLOT_NOT_FOUND');
        if (newSlot.endUTC.getTime() <= Date.now()) throw new BadRequestException('SLOT_IN_PAST');
        if (isHeldByOther(newSlot, userId)) throw new BadRequestException('SLOT_HELD');
        const activeCount = await countActiveSeats(tx, newSlotId);
        if (activeCount >= newSlot.capacity) throw new BadRequestException('SLOT_FULL');
        await this.assertNoUserOverlap(tx, userId, newSlot, id);
        // The mover's own hold on the target slot is used up by this move
        // (REV-20261106-02), the same as in createBooking.
        if (newSlot.holdExpires && newSlot.holdUserId === userId) {
          await tx.slot.update({ where: { id: newSlotId }, data: { holdToken: null, holdExpires: null, holdUserId: null } });
        }
        // Booking.coachId always follows the slot owner.
        return tx.booking.update({ where: { id }, data: { slotId: newSlotId, coachId: newSlot.coachId } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (e) {
      if (isSerializationFailure(e)) throw new ConflictException('SLOT_BUSY');
      throw e;
    }
  }

  /**
   * Hold a slot for `userId` for HOLD_TTL. The hold is placed with one
   * conditional update, so two callers cannot both win, an active hold is not
   * renewable, and a user holds at most one slot: a new hold releases the
   * user's previous one.
   */
  async holdSlot(userId: number, slotId: number): Promise<{ token: string; expiresAt: string }> {
    const slot = await this.prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot) throw new BadRequestException('SLOT_NOT_FOUND');
    if (slot.endUTC.getTime() <= Date.now()) throw new BadRequestException('SLOT_IN_PAST');
    const now = new Date();
    const token = randomUUID();
    const expires = new Date(now.getTime() + this.HOLD_TTL_MS);
    // Place the hold first, release the user's other holds only if it was
    // placed. An active hold, the caller's own included, cannot be renewed.
    const placed = await this.prisma.$transaction(async (tx) => {
      const p = await tx.slot.updateMany({
        where: { id: slotId, OR: [{ holdExpires: null }, { holdExpires: { lte: now } }] },
        data: { holdToken: token, holdExpires: expires, holdUserId: userId },
      });
      if (p.count === 1) {
        await tx.slot.updateMany({
          where: { holdUserId: userId, NOT: { id: slotId } },
          data: { holdToken: null, holdExpires: null, holdUserId: null },
        });
      }
      return p;
    });
    if (placed.count !== 1) throw new BadRequestException('HOLD_EXISTS');
    return { token, expiresAt: expires.toISOString() };
  }

  async confirmPayment(bookingId: number, paymentRef: string): Promise<Booking> {
    // Only a PENDING booking can be confirmed, in one conditional write. A
    // booking cancelled (by the user or expireStale) may have released its
    // seat to someone else: confirming it would overbook the slot.
    const res = await this.prisma.booking.updateMany({ where: { id: bookingId, status: 'PENDING' }, data: { status: 'CONFIRMED', paymentRef } });
    const b = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!b) throw new BadRequestException('BOOKING_NOT_FOUND');
    if (res.count === 1 || b.status === 'CONFIRMED') return b;
    throw new ConflictException('BOOKING_NOT_PENDING');
  }

  async listMy(userId: number): Promise<{ items: (Booking & { slot: Slot })[] }> {
    const items = await this.prisma.booking.findMany({
      where: { userId, status: { in: ACTIVE } },
      orderBy: { createdAt: 'desc' },
      include: { slot: true },
    });
    return { items };
  }

  /** Expire stale holds and auto-cancel PENDING bookings past the payment TTL. */
  async expireStale(): Promise<void> {
    await this.prisma.slot.updateMany({
      where: { holdExpires: { lt: new Date() } },
      data: { holdToken: null, holdExpires: null, holdUserId: null },
    });
    const cutoff = new Date(Date.now() - this.PAYMENT_TTL_MS);
    await this.prisma.booking.updateMany({
      where: { status: 'PENDING', createdAt: { lt: cutoff } },
      data: { status: 'CANCELLED' },
    });
  }

  /** Reject when the user already has an active booking overlapping `slot`.
   *  Single query with the slot included (the original looked each slot up in
   *  a loop). */
  private async assertNoUserOverlap(
    tx: Prisma.TransactionClient,
    userId: number,
    slot: Slot,
    excludeBookingId?: number,
  ): Promise<void> {
    const mine = await tx.booking.findMany({
      where: {
        userId,
        status: { in: ACTIVE },
        ...(excludeBookingId ? { NOT: { id: excludeBookingId } } : {}),
      },
      include: { slot: true },
    });
    for (const b of mine) {
      if (overlaps(slot.startUTC, slot.endUTC, b.slot.startUTC, b.slot.endUTC)) {
        throw new BadRequestException('USER_OVERLAP');
      }
    }
    if (await hasOverlappingReservation(tx, userId, slot)) throw new BadRequestException('USER_OVERLAP');
  }
}
