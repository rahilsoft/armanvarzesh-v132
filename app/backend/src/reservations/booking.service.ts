import { randomUUID } from 'crypto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Booking, Slot } from '@prisma/client';

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
    const s = new Date(startUTC), e = new Date(endUTC);
    if (!(s < e)) throw new BadRequestException('RANGE_INVALID');
    return this.prisma.slot.create({ data: { coachId, startUTC: s, endUTC: e, capacity } });
  }

  async createBooking(userId: number, coachId: number, slotId: number, mode: string): Promise<BookingCreated> {
    const slot = await this.prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot) throw new BadRequestException('SLOT_NOT_FOUND');
    if (slot.endUTC.getTime() <= Date.now()) throw new BadRequestException('SLOT_IN_PAST');

    // Expire a stale hold on this slot.
    if (slot.holdExpires && slot.holdExpires.getTime() < Date.now()) {
      await this.prisma.slot.update({ where: { id: slotId }, data: { holdToken: null, holdExpires: null } });
    }

    const activeCount = await this.prisma.booking.count({ where: { slotId, status: { in: ACTIVE } } });
    if (activeCount >= slot.capacity) throw new BadRequestException('SLOT_FULL');

    await this.assertNoUserOverlap(userId, slot);

    const booking = await this.prisma.booking.create({
      data: { userId, coachId, slotId, status: 'PENDING', mode },
    });
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
    const b = await this.prisma.booking.findUnique({ where: { id } });
    if (!b || b.userId !== userId) throw new BadRequestException('NOT_FOUND_OR_FORBIDDEN');
    const newSlot = await this.prisma.slot.findUnique({ where: { id: newSlotId } });
    if (!newSlot) throw new BadRequestException('SLOT_NOT_FOUND');
    const activeCount = await this.prisma.booking.count({ where: { slotId: newSlotId, status: { in: ACTIVE } } });
    if (activeCount >= newSlot.capacity) throw new BadRequestException('SLOT_FULL');
    await this.assertNoUserOverlap(userId, newSlot, id);
    return this.prisma.booking.update({ where: { id }, data: { slotId: newSlotId } });
  }

  async holdSlot(slotId: number): Promise<{ token: string; expiresAt: string }> {
    const slot = await this.prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot) throw new BadRequestException('SLOT_NOT_FOUND');
    const now = Date.now();
    if (slot.holdExpires && slot.holdExpires.getTime() > now) throw new BadRequestException('HOLD_EXISTS');
    const token = randomUUID();
    const expires = new Date(now + this.HOLD_TTL_MS);
    await this.prisma.slot.update({ where: { id: slotId }, data: { holdToken: token, holdExpires: expires } });
    return { token, expiresAt: expires.toISOString() };
  }

  async confirmPayment(bookingId: number, paymentRef: string): Promise<Booking> {
    const b = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!b) throw new BadRequestException('BOOKING_NOT_FOUND');
    if (b.status === 'CONFIRMED') return b;
    return this.prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED', paymentRef } });
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
      data: { holdToken: null, holdExpires: null },
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
  private async assertNoUserOverlap(userId: number, slot: Slot, excludeBookingId?: number): Promise<void> {
    const mine = await this.prisma.booking.findMany({
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
  }
}
