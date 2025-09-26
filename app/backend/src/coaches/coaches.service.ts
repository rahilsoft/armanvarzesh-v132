
import { Injectable } from '@nestjs/common';
import { Coach } from './entities/coach.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CoachesService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Coach | undefined> {
    return this.prisma.coach.findUnique({ where: { email } });
  }
  async create(coach: Partial<Coach>): Promise<Coach> {
    return this.prisma.coach.create({ data: { email: coach.email, name: coach.name, expertise: coach.expertise, createdAt: new Date() } });
  }
  async update(id: number, input: Partial<Coach>): Promise<Coach> {
    return this.prisma.coach.update({ where: { id }, data: { email: input.email, name: input.name, expertise: input.expertise } });
  }
  async findOne(id: number): Promise<Coach> {
    return this.prisma.coach.findUnique({ where: { id } });
  }
  async findAll(): Promise<Coach[]> {
    return this.prisma.coach.findMany();
  }

  /**
   * Remove a coach by their ID. Returns true if removed, otherwise false.
   */
  async delete(id: number): Promise<boolean> {
    await this.prisma.coach.delete({ where: { id } });
    return true;
  }
}
