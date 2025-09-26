import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

function uid(): string { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8); return v.toString(16);
});}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date){
  return aStart < bEnd && bStart < aEnd;
}

@Injectable()
export class BookingService {
  prisma = new PrismaClient();
  HOLD_TTL_MS = 10 * 60 * 1000; // 10 minutes
  PAYMENT_TTL_MS = 30 * 60 * 1000; // 30 minutes

  async createSlot(coachId: string, startUTC: string, endUTC: string, capacity: number=1){
    const s = new Date(startUTC), e = new Date(endUTC);
    if (!(s < e)) throw new BadRequestException('RANGE_INVALID');
    return this.prisma.slot.create({ data: { id: uid(), coachId, startUTC: s, endUTC: e, capacity } });
  }

  async createBooking(userId: string, coachId: string, slotId: string, mode: string){
    const slot = await this.prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot) throw new BadRequestException('SLOT_NOT_FOUND');
    if (new Date(slot.endUTC).getTime() <= Date.now()) throw new BadRequestException('SLOT_IN_PAST');

    // expire hold
    if (slot.holdExpires && new Date(slot.holdExpires).getTime() < Date.now()){
      await this.prisma.slot.update({ where: { id: slotId }, data: { holdToken: null, holdExpires: null } });
    }

    // capacity check: count active bookings
    const activeCount = await this.prisma.booking.count({ where: { slotId, status: { in: ['PENDING','CONFIRMED'] } } });
    if (activeCount >= slot.capacity) throw new BadRequestException('SLOT_FULL');

    // user overlap check with other bookings (pending/confirmed)
    const my = await this.prisma.booking.findMany({ where: { userId, status: { in: ['PENDING','CONFIRMED'] } }, include: { } });
    for (const b of my){
      const s2 = await this.prisma.slot.findUnique({ where: { id: b.slotId } });
      if (s2 && overlaps(slot.startUTC as any, slot.endUTC as any, s2.startUTC as any, s2.endUTC as any)){
        throw new BadRequestException('USER_OVERLAP');
      }
    }

    const id = uid();
    await this.prisma.booking.create({ data: { id, userId, coachId, slotId, status: 'PENDING', mode } });
    // simulate payment checkout creation (delegate to payments-service in prod)
    const paymentCheckoutUrl = `https://payments.example/checkout?booking=${id}`;
    return { id, status: 'PENDING', paymentCheckoutUrl, expiresAt: new Date(Date.now()+this.PAYMENT_TTL_MS).toISOString() };
  }

  async cancelBooking(userId: string, id: string){
    const b = await this.prisma.booking.findUnique({ where: { id } });
    if (!b || b.userId !== userId) throw new BadRequestException('NOT_FOUND_OR_FORBIDDEN');
    if (b.status === 'CANCELLED') return b;
    return this.prisma.booking.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  async reschedule(userId: string, id: string, newSlotId: string){
    const b = await this.prisma.booking.findUnique({ where: { id } });
    if (!b || b.userId !== userId) throw new BadRequestException('NOT_FOUND_OR_FORBIDDEN');
    const newSlot = await this.prisma.slot.findUnique({ where: { id: newSlotId } });
    if (!newSlot) throw new BadRequestException('SLOT_NOT_FOUND');
    // capacity
    const activeCount = await this.prisma.booking.count({ where: { slotId: newSlotId, status: { in: ['PENDING','CONFIRMED'] } } });
    if (activeCount >= newSlot.capacity) throw new BadRequestException('SLOT_FULL');
    // overlap
    const my = await this.prisma.booking.findMany({ where: { userId, status: { in: ['PENDING','CONFIRMED'] }, NOT: { id } } });
    for (const mb of my){
      const s2 = await this.prisma.slot.findUnique({ where: { id: mb.slotId } });
      if (s2 && overlaps(newSlot.startUTC as any, newSlot.endUTC as any, s2.startUTC as any, s2.endUTC as any)){
        throw new BadRequestException('USER_OVERLAP');
      }
    }
    return this.prisma.booking.update({ where: { id }, data: { slotId: newSlotId } });
  }

  async holdSlot(slotId: string){
    const slot = await this.prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot) throw new BadRequestException('SLOT_NOT_FOUND');
    const now = Date.now();
    if (slot.holdExpires && new Date(slot.holdExpires).getTime() > now) throw new BadRequestException('HOLD_EXISTS');
    const token = uid();
    await this.prisma.slot.update({ where: { id: slotId }, data: { holdToken: token, holdExpires: new Date(now + this.HOLD_TTL_MS) } });
    return { token, expiresAt: new Date(now + this.HOLD_TTL_MS).toISOString() };
  }

  async confirmPayment(bookingId: string, paymentId: string){
    const b = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!b) throw new BadRequestException('BOOKING_NOT_FOUND');
    if (b.status === 'CONFIRMED') return b;
    // mark confirmed
    return this.prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED', paymentId } });
  }

  // DST-safe utilities
  utcToTz(isoUtc: string, tz: string){
    const d = new Date(isoUtc);
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12: False, year: 'numeric', month: '2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
    const [{value:month},,{value:day},,{value:year},,{value:hour},,{value:minute}] = fmt.formatToParts(d);
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  async listMy(userId: string){
    const rows = await this.prisma.booking.findMany({ where: { userId, status: { in: ['PENDING','CONFIRMED'] } }, orderBy: { createdAt:'desc' } });
    // attach slot info
    const result = [];
    for (const r of rows){
      const slot = await this.prisma.slot.findUnique({ where: { id: r.slotId } });
      result.push({ ...r, slot });
    }
    return { items: result };
  }

  async expireStale(){
    // expire holds
    await this.prisma.slot.updateMany({ where: { holdExpires: { lt: new Date() } }, data: { holdToken: null, holdExpires: null } });
    // cancel pending bookings older than TTL
    const cutoff = new Date(Date.now() - this.PAYMENT_TTL_MS);
    await this.prisma.booking.updateMany({ where: { status: 'PENDING', createdAt: { lt: cutoff } }, data: { status: 'CANCELLED' } });
  }
}
