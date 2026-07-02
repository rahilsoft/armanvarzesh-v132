
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CorporateService {
  constructor(private prisma: PrismaService) {}

  async create(input: any): Promise<any> {
    return this.prisma.corporate.create({ data: { companyName: input.companyName, industry: input.industry, createdAt: new Date() } });
  }
  async findAll(): Promise<any[]> {
    return this.prisma.corporate.findMany();
  }
  async findOne(id: number): Promise<any> {
    return this.prisma.corporate.findUnique({ where: { id } });
  }

  /**
   * Update an existing corporate record. Returns the updated record or null.
   */
  async update(id: number, input: any): Promise<any> {
    return this.prisma.corporate.update({ where: { id }, data: { companyName: input.companyName, industry: input.industry } });
  }

  /**
   * Delete a corporate record. Returns true if removed, false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    await this.prisma.corporate.delete({ where: { id } });
    return true;
  }
}
