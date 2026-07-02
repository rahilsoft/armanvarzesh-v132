import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Coach as PrismaCoach } from '@prisma/client';

/** Writable coach fields, including the profile attributes folded from the
 *  former coaches-service. Its `password` column was not ported — coach
 *  credentials belong to the canonical User auth. */
export interface CoachWriteInput {
  email?: string;
  name?: string;
  expertise?: string;
  speciality?: string;
  certifications?: string;
  bio?: string;
}

/** Keep only defined, known columns — never forward arbitrary keys to Prisma. */
function pickCoachFields(input: CoachWriteInput): CoachWriteInput {
  const out: CoachWriteInput = {};
  const keys: (keyof CoachWriteInput)[] = ['email', 'name', 'expertise', 'speciality', 'certifications', 'bio'];
  for (const k of keys) if (input[k] !== undefined) out[k] = input[k];
  return out;
}

@Injectable()
export class CoachesService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<PrismaCoach | null> {
    return this.prisma.coach.findUnique({ where: { email } });
  }

  async create(coach: CoachWriteInput & { email: string; name: string; expertise: string }): Promise<PrismaCoach> {
    return this.prisma.coach.create({
      data: { ...pickCoachFields(coach), email: coach.email, name: coach.name, expertise: coach.expertise, createdAt: new Date() },
    });
  }

  async update(id: number, input: CoachWriteInput): Promise<PrismaCoach> {
    return this.prisma.coach.update({ where: { id }, data: pickCoachFields(input) });
  }

  /** Mark a coach as verified (folded from coaches-service). */
  async verify(id: number): Promise<PrismaCoach> {
    return this.prisma.coach.update({ where: { id }, data: { verified: true } });
  }

  async findOne(id: number): Promise<PrismaCoach | null> {
    return this.prisma.coach.findUnique({ where: { id } });
  }

  async findAll(verifiedOnly = false): Promise<PrismaCoach[]> {
    return this.prisma.coach.findMany({ where: verifiedOnly ? { verified: true } : {} });
  }

  /**
   * Remove a coach by their ID. Returns true if removed, otherwise false.
   */
  async delete(id: number): Promise<boolean> {
    await this.prisma.coach.delete({ where: { id } });
    return true;
  }
}
