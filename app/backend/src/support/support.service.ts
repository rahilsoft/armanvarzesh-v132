
import { Injectable } from '@nestjs/common';
import { Support } from './entities/support.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async create(input: Partial<Support>): Promise<Support> {
    return this.prisma.support.create({ data: { userEmail: input.userEmail, subject: input.subject, message: input.message, status: 'open', createdAt: new Date() } });
  }
  async findAll(): Promise<Support[]> {
    return this.prisma.support.findMany();
  }
  async findOne(id: number): Promise<Support> {
    return this.prisma.support.findUnique({ where: { id } });
  }

  /**
   * Update a support ticket's fields. Only provided properties will be
   * updated. Returns the updated ticket or null if not found.
   */
  async update(id: number, input: Partial<Support>): Promise<Support> {
    return this.prisma.support.update({ where: { id }, data: { userEmail: input.userEmail, subject: input.subject, message: input.message, status: input.status } });
  }

  /**
   * Delete a support ticket. Returns true if removed, false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    await this.prisma.support.delete({ where: { id } });
    return true;
  }
}
