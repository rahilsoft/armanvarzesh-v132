
import { Injectable } from '@nestjs/common';
import { Payroll } from './entities/payroll.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async create(input: Partial<Payroll>): Promise<Payroll> {
    return this.prisma.payroll.create({ data: { coachName: input.coachName, amount: input.amount, period: input.period, createdAt: new Date() } });
  }
  async findAll(): Promise<Payroll[]> {
    return this.prisma.payroll.findMany();
  }
  async findOne(id: number): Promise<Payroll> {
    return this.prisma.payroll.findUnique({ where: { id } });
  }

  /**
   * Update an existing payroll record. Returns the updated record or null.
   */
  async update(id: number, input: Partial<Payroll>): Promise<Payroll> {
    return this.prisma.payroll.update({ where: { id }, data: { coachName: input.coachName, amount: input.amount, period: input.period } });
  }

  /**
   * Delete a payroll record. Returns true if removed, otherwise false.
   */
  async delete(id: number): Promise<boolean> {
    await this.prisma.payroll.delete({ where: { id } });
    return true;
  }
}
