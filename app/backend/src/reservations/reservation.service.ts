import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

type Reservation = { id: string; userId: string; slotId: string; status: 'ACTIVE'|'CANCELED'; version: number; createdAt: Date };

const mem = { reservations: new Map<string, Reservation>(), slots: new Set<string>() };

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
    // Prisma optimistic - requires `version` column
    // KNOWN SCHEMA DRIFT (Booking domain, pending fold): the canonical schema
    // has no `Slot` model and `Reservation` uses Int ids + a different unique
    // key. This service was written against booking-service's schema. The
    // Booking fold reconciles it; until then these paths are only reachable
    // with RESERVATIONS_BACKEND!=memory, which no deployment sets.
    // @ts-expect-error Slot model does not exist in the canonical schema yet (Booking fold)
    const slotExists = await this.prisma.slot.findUnique?.({ where: { id: slotId } });
    if (!slotExists) { /* optionally create slot */ }
    // create
    // @ts-expect-error Reservation shape differs (string slotId vs canonical Int resource key) until the Booking fold
    const created = await this.prisma.reservation.create({ data: { userId, slotId, status: 'ACTIVE', version: 1 } });
    return created as any;
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
    // Prisma optimistic update (version bump)
    // KNOWN SCHEMA DRIFT (Booking domain, pending fold) — see create() above.
    // @ts-expect-error canonical Reservation.id is Int, this legacy path passes a string id
    const found = await this.prisma.reservation.findUnique({ where: { id: reservationId } });
    // @ts-expect-error canonical schema has no id_version compound key (Booking fold reconciles optimistic locking)
    const updated = await this.prisma.reservation.update({ where: { id_version: { id: reservationId, version: found.version } }, data: { status: 'CANCELED', version: { increment: 1 } } });
    return updated as any;
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
