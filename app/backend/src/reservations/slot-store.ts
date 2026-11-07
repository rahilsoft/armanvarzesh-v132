import { BadRequestException, ConflictException } from '@nestjs/common';
import { Prisma, Slot } from '@prisma/client';

type SlotWriter = { slot: { create(args: { data: Prisma.SlotUncheckedCreateInput }): Promise<Slot> } };

/**
 * The single write path for a new Slot, used by REST (/booking/slots/create)
 * and GraphQL (createAvailability). The database unique index
 * uq_Slot_coach_time is the guard, so two concurrent requests for the same
 * coach and range create one row and the loser gets 409 (REV-20261107-02).
 */
export async function createCanonicalSlot(
  prisma: SlotWriter,
  input: { coachId: number; start: Date; end: Date; capacity?: number },
): Promise<Slot> {
  const { coachId, start, end } = input;
  const capacity = input.capacity ?? 1;
  if (!Number.isInteger(coachId) || coachId <= 0) throw new BadRequestException('coachId must be a positive integer');
  if (isNaN(+start) || isNaN(+end)) throw new BadRequestException('start and end must be valid dates');
  if (!(start < end)) throw new BadRequestException('RANGE_INVALID');
  if (!Number.isInteger(capacity) || capacity < 1) throw new BadRequestException('capacity must be a positive integer');
  try {
    return await prisma.slot.create({ data: { coachId, startUTC: start, endUTC: end, capacity } });
  } catch (e) {
    if (isUniqueViolation(e)) throw new ConflictException('SLOT_EXISTS');
    throw e;
  }
}

export function isUniqueViolation(e: unknown): boolean {
  return !!e && typeof e === 'object' && (e as { code?: string }).code === 'P2002';
}
