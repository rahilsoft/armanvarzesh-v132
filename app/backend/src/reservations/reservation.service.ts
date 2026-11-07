import { Injectable, BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { createCanonicalSlot } from './slot-store';
import { countActiveSeats, hasOverlappingBooking, hasOverlappingReservation, isHeldByOther, isSerializationFailure } from './booking.service';

type Reservation = { id: string; userId: string; coachId?: string; slotId: string; status: 'ACTIVE'|'CANCELED'; version: number; createdAt?: Date; startsAt?: Date; endsAt?: Date };

export type CancelActor = { userId: string; isAdmin?: boolean };

/** Reservation as exposed over GraphQL (entities/reservation.entity.ts). */
export type ReservationView = {
  id: string; userId: string; coachId: string; slotId: string; status: string;
  start: Date; end: Date; createdAt?: Date | null;
};

/** Availability slot as exposed over GraphQL (entities/availability.entity.ts). */
export type AvailabilityView = {
  id: string; coachId: string; start: Date; end: Date; recurrence?: string | null; createdAt: Date;
};

const PG_INT_MAX = 2147483647;

/** Parse a client-supplied numeric id, rejecting anything that is not a positive Postgres Int. */
export function parseIntId(raw: string | number, name: string): number {
  const s = String(raw ?? '').trim();
  const n = /^[1-9]\d*$/.test(s) ? Number(s) : NaN;
  if (!Number.isSafeInteger(n) || n > PG_INT_MAX) throw new BadRequestException(`${name} must be a positive integer id`);
  return n;
}

const mem = { reservations: new Map<string, Reservation>(), slots: new Set<string>() };

/** Map a canonical (Int-keyed) reservation row to this service's legacy
 *  string-id shape. The canonical Reservation has no createdAt column. */
function toLegacyReservation(row: { id: number; userId: number; resourceId: number; status: string; version: number; startsAt?: Date; endsAt?: Date }): Reservation {
  return {
    id: String(row.id),
    userId: String(row.userId),
    slotId: String(row.resourceId),
    status: row.status === 'CANCELED' ? 'CANCELED' : 'ACTIVE',
    version: row.version,
    startsAt: row.startsAt,
    endsAt: row.endsAt,
  };
}

@Injectable()
export class ReservationService {
  constructor(private readonly prisma?: PrismaService) {}

  private isMemory(): boolean {
    return (process.env.MEMORY_DB === 'true') || !this.prisma;
  }

  async seedMemory() {
    mem.slots.add('slot-1');
    mem.slots.add('slot-2');
  }

  /**
   * Reserve a seat on a canonical Slot for `userId` (from the verified JWT).
   * When the caller names a coach (GraphQL input), it must own the slot.
   * Seats are shared with the Booking table: capacity, an unexpired hold and
   * the insert run in one Serializable transaction, so REST Booking, REST
   * Reservation and GraphQL cannot together overbook a slot
   * (REV-20261106-01, REV-20261106-02).
   */
  async reserve(userId: string, slotId: string, coachId?: string): Promise<Reservation> {
    if (this.isMemory()) {
      if (!mem.slots.has(slotId)) mem.slots.add(slotId);
      // optimistic: no duplicate ACTIVE for same slot
      for (const r of mem.reservations.values()) {
        if (r.slotId === slotId && r.status === 'ACTIVE') throw new ConflictException('Slot already reserved');
      }
      const r: Reservation = { id: 'r-' + Date.now().toString(36), userId, slotId, status: 'ACTIVE', version: 1, createdAt: new Date() };
      mem.reservations.set(r.id, r);
      return r;
    }
    if (!this.prisma) throw new ConflictException('Persistence unavailable');
    const prisma = this.prisma;
    const id = parseIntId(slotId, 'slotId');
    const expectedCoach = coachId === undefined || coachId === null || coachId === '' ? undefined : parseIntId(coachId, 'coachId');
    try {
      return await prisma.$transaction(async (tx) => {
        const slot = await tx.slot.findUnique({ where: { id } });
        if (!slot) throw new ConflictException('Slot not found');
        if (expectedCoach !== undefined && slot.coachId !== expectedCoach) throw new ConflictException('Slot does not belong to this coach');
        if (slot.endUTC.getTime() <= Date.now()) throw new BadRequestException('Slot is in the past');
        if (isHeldByOther(slot, Number(userId))) throw new ConflictException('Slot is held');
        // One seat per user per time range, across both tables.
        if (await hasOverlappingReservation(tx, Number(userId), slot) || await hasOverlappingBooking(tx, Number(userId), slot)) {
          throw new ConflictException('User already has a session at this time');
        }
        if ((await countActiveSeats(tx, slot.id)) >= slot.capacity) throw new ConflictException('Slot already reserved');
        if (slot.holdExpires) await tx.slot.update({ where: { id: slot.id }, data: { holdToken: null, holdExpires: null, holdUserId: null } });
        const created = await tx.reservation.create({
          data: {
            userId: Number(userId),
            resourceId: slot.id,
            startsAt: slot.startUTC,
            endsAt: slot.endUTC,
            status: 'ACTIVE',
            version: 1,
          },
        });
        return { ...toLegacyReservation(created), coachId: String(slot.coachId) };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (e) {
      // Losing the race (unique index or serialization abort) is a conflict, not a server error.
      if ((e as { code?: string })?.code === 'P2002' || isSerializationFailure(e)) throw new ConflictException('Slot already reserved');
      throw e;
    }
  }

  /**
   * Cancel a reservation on behalf of `actor`. Only the owner (or an admin
   * principal) may cancel. Ownership is part of the write condition itself, so
   * a check-then-write race cannot cancel someone else's row. A reservation the
   * actor does not own is reported as not found, without revealing that it
   * exists. (REV-20261022-01)
   */
  async cancel(reservationId: string, actor: CancelActor): Promise<Reservation> {
    if (!actor || !actor.userId) throw new ForbiddenException('Actor required');
    if (this.isMemory()) {
      const r = mem.reservations.get(reservationId);
      if (!r || (!actor.isAdmin && String(r.userId) !== String(actor.userId))) throw new NotFoundException('Reservation not found');
      if (r.status !== 'ACTIVE') throw new ConflictException('Already canceled');
      r.status = 'CANCELED';
      r.version += 1;
      mem.reservations.set(r.id, r);
      return r;
    }
    if (!this.prisma) throw new ConflictException('Persistence unavailable');
    const id = parseIntId(reservationId, 'reservationId');
    const ownerId = Number(actor.userId);
    const ownerFilter = actor.isAdmin ? {} : { userId: ownerId };
    const found = await this.prisma.reservation.findFirst({ where: { id, ...ownerFilter } });
    if (!found) throw new NotFoundException('Reservation not found');
    if (found.status === 'CANCELED') throw new ConflictException('Already canceled');
    // Optimistic lock (id, version) plus the ownership filter in the same
    // statement: a stale or foreign writer updates zero rows.
    const res = await this.prisma.reservation.updateMany({
      where: { id: found.id, version: found.version, status: { not: 'CANCELED' }, ...ownerFilter },
      data: { status: 'CANCELED', version: { increment: 1 } },
    });
    if (res.count !== 1) throw new ConflictException('Reservation changed concurrently');
    const updated = await this.prisma.reservation.findUniqueOrThrow({ where: { id: found.id } });
    return toLegacyReservation(updated);
  }

  /** Map canonical reservation rows to the GraphQL shape. The coach is the owner of the booked slot. */
  private async toViews(rows: Array<{ id: number; userId: number; resourceId: number; status: string; startsAt: Date; endsAt: Date }>): Promise<ReservationView[]> {
    if (!rows.length) return [];
    const ids = Array.from(new Set(rows.map((r) => r.resourceId)));
    const slots: Array<{ id: number; coachId: number }> = await (this.prisma as any).slot.findMany({ where: { id: { in: ids } } });
    const coachBySlot = new Map(slots.map((s) => [s.id, String(s.coachId)]));
    return rows.map((r) => ({
      id: String(r.id),
      userId: String(r.userId),
      coachId: coachBySlot.get(r.resourceId) ?? '',
      slotId: String(r.resourceId),
      status: r.status,
      start: r.startsAt,
      end: r.endsAt,
      createdAt: null,
    }));
  }

  async listByUser(userId: number): Promise<ReservationView[]> {
    if (this.isMemory()) {
      return Array.from(mem.reservations.values())
        .filter((r) => String(r.userId) === String(userId))
        .map((r) => ({ id: r.id, userId: r.userId, coachId: r.coachId ?? '', slotId: r.slotId, status: r.status, start: r.startsAt ?? r.createdAt!, end: r.endsAt ?? r.createdAt!, createdAt: r.createdAt ?? null }));
    }
    // The canonical Reservation has no createdAt column: newest session first.
    const rows = await (this.prisma as any).reservation.findMany({ where: { userId }, orderBy: { startsAt: 'desc' } });
    return this.toViews(rows);
  }

  /** Reservations on slots owned by `coachId` (Reservation.resourceId is Slot.id). */
  async listByCoach(coachId: number): Promise<ReservationView[]> {
    if (this.isMemory()) return [];
    const slots: Array<{ id: number }> = await (this.prisma as any).slot.findMany({ where: { coachId } });
    if (!slots.length) return [];
    const rows = await (this.prisma as any).reservation.findMany({
      where: { resourceId: { in: slots.map((s) => s.id) } },
      orderBy: { startsAt: 'desc' },
    });
    return this.toViews(rows);
  }

  async findUpcomingSessions(rangeStart?: Date, rangeEnd?: Date) {
    if (this.isMemory()) {
      return Array.from(mem.reservations.values()).filter((r) => r.status === 'ACTIVE');
    }
    const where: any = { status: 'ACTIVE' };
    if (rangeStart || rangeEnd) {
      where.startsAt = {};
      if (rangeStart) where.startsAt.gte = rangeStart;
      if (rangeEnd) where.startsAt.lt = rangeEnd;
    }
    return (this.prisma as any).reservation.findMany({ where, orderBy: { startsAt: 'asc' } });
  }
}

/**
 * Availability as served over GraphQL is the canonical Slot table, the same
 * rows bookReservation reserves, so an id from coachAvailability always names
 * that coach's slot and time (REV-20261106-01). The legacy AvailabilitySlot
 * table is no longer read or written by this surface, its rows were copied
 * into Slot by migration 20261107000000. Slot has no recurrence
 * column, so a recurrence rule is rejected instead of being silently dropped.
 */
@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async createAvailability(input: { coachId: number | string; startsAt: Date | string; endsAt: Date | string; rrule?: string | null }): Promise<AvailabilityView> {
    const coachId = parseIntId(input.coachId, 'coachId');
    if (input.rrule) throw new BadRequestException('recurrence is not supported, create one slot per session');
    // Same write path and database uniqueness guard as REST slot creation.
    const row = await createCanonicalSlot(this.prisma, { coachId, start: new Date(input.startsAt), end: new Date(input.endsAt) });
    return toAvailabilityView(row);
  }

  async listCoachAvailability(coachId: number | string): Promise<AvailabilityView[]> {
    const id = parseIntId(coachId, 'coachId');
    const rows = await this.prisma.slot.findMany({
      where: { coachId: id },
      orderBy: { startUTC: 'asc' },
    });
    return rows.map(toAvailabilityView);
  }
}

function toAvailabilityView(row: { id: number; coachId: number; startUTC: Date; endUTC: Date; createdAt: Date }): AvailabilityView {
  return {
    id: String(row.id),
    coachId: String(row.coachId),
    start: row.startUTC,
    end: row.endUTC,
    recurrence: null,
    createdAt: row.createdAt,
  };
}
