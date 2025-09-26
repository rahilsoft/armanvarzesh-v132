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
    // @ts-ignore
    const slotExists = await this.prisma.slot.findUnique?.({ where: { id: slotId } });
    if (!slotExists) { /* optionally create slot */ }
    // create
    // @ts-ignore
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
    // @ts-ignore
    const found = await this.prisma.reservation.findUnique({ where: { id: reservationId } });
    // @ts-ignore
    const updated = await this.prisma.reservation.update({ where: { id_version: { id: reservationId, version: found.version } }, data: { status: 'CANCELED', version: { increment: 1 } } });
    return updated as any;
  }
}
