import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Coach as PrismaCoach } from '@prisma/client';

/**
 * Service providing CRUD operations for coaches in the coaches
 * microservice. Uses Prisma to persist data to the configured
 * database.
 */
@Injectable()
export class CoachesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PrismaCoach[]> {
    return this.prisma.coach.findMany();
  }

  async findOne(id: number): Promise<PrismaCoach | null> {
    return this.prisma.coach.findUnique({ where: { id } });
  }

  async create(data: Partial<PrismaCoach>): Promise<PrismaCoach> {
    return this.prisma.coach.create({ data: data as PrismaCoach });
  }

  async update(id: number, data: Partial<PrismaCoach>): Promise<PrismaCoach | null> {
    try {
      return await this.prisma.coach.update({ where: { id }, data });
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.coach.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async verify(id: number): Promise<PrismaCoach | null> {
    try {
      return await this.prisma.coach.update({ where: { id }, data: { verified: true } });
    } catch {
      return null;
    }
  }
}