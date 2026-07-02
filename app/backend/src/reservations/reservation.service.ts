import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

type Reservation = { id: string; userId: string; slotId: string; status: 'ACTIVE'|'CANCELED'; version: number; createdAt?: Date };

const mem = { reservations: new Map<string, Reservation>(), slots: new Set<string>() };

/** Map a canonical (Int-keyed) reservation row to this service's legacy
 *  string-id shape. The canonical Reservation has no createdAt column. */
function toLegacyReservation(row: { id: number; userId: number; resourceId: number; status: string; version: number }): Reservation {
  return {
    id: String(row.id),
    userId: String(row.userId),
    slotId: String(row.resourceId),
    status: row.status === 'CANCELED' ? 'CANCELED' : 'ACTIVE',
    version: row.version,
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

  async reserve(userId: string, slotId: string): Promise<Reservation> {
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
    // Prisma path (Booking fold): Slot is now a canonical model and
    // Reservation is addressed with Int keys. The slot's time range fills the
    // reservation window, and the (resourceId, startsAt, endsAt) unique key
    // rejects double-booking at the database.
    if (!this.prisma) throw new ConflictException('Persistence unavailable');
    const slot = await this.prisma.slot.findUnique({ where: { id: Number(slotId) } });
    if (!slot) throw new ConflictException('Slot not found');
    const created = await this.prisma.reservation.create({
      data: {
        userId: Number(userId),
        resourceId: slot.id,
        startsAt: slot.startUTC,
        endsAt: slot.endUTC,
        status: 'ACTIVE',
        version: 1,
      },
    });
    return toLegacyReservation(created);
  }

  async cancel(reservationId: string): Promise<Reservation> {
    if (this.isMemory()) {
      const r = mem.reservations.get(reservationId);
      if (!r) throw new ConflictException('Not found');
      if (r.status !== 'ACTIVE') throw new ConflictException('Already canceled');
      r.status = 'CANCELED';
      r.version += 1;
      mem.reservations.set(r.id, r);
      return r;
    }
    // Prisma optimistic update (version bump). The Booking fold added the
    // (id, version) compound unique, so a stale writer misses the row.
    if (!this.prisma) throw new ConflictException('Persistence unavailable');
    const found = await this.prisma.reservation.findUnique({ where: { id: Number(reservationId) } });
    if (!found) throw new ConflictException('Not found');
    const updated = await this.prisma.reservation.update({
      where: { id_version: { id: found.id, version: found.version } },
      data: { status: 'CANCELED', version: { increment: 1 } },
    });
    return toLegacyReservation(updated);
  }

  async listByUser(userId: number) {
    if (this.isMemory()) {
      return Array.from(mem.reservations.values()).filter((r) => String(r.userId) === String(userId));
    }
    return (this.prisma as any).reservation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async listByCoach(coachId: number) {
    if (this.isMemory()) return [];
    return (this.prisma as any).reservation.findMany({ where: { coachId }, orderBy: { createdAt: 'desc' } });
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
    return (this.prisma as any).reservation.findMany({ where, orderBy: { createdAt: 'asc' } });
  }
}

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async createAvailability(input: { coachId: number | string; startsAt: Date | string; endsAt: Date | string; rrule?: string }) {
    return (this.prisma as any).availabilitySlot.create({
      data: {
        coachId: Number(input.coachId),
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt),
        rrule: input.rrule ?? null,
      },
    });
  }

  async listCoachAvailability(coachId: number | string) {
    return (this.prisma as any).availabilitySlot.findMany({
      where: { coachId: Number(coachId) },
      orderBy: { startsAt: 'asc' },
    });
  }
}
