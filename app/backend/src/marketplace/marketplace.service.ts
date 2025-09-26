
import { Injectable } from '@nestjs/common';
import { Marketplace } from './entities/marketplace.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  async create(input: Partial<Marketplace>): Promise<Marketplace> {
    return this.prisma.marketplace.create({ data: { name: input.name, description: input.description, price: input.price, createdAt: new Date() } });
  }
  async update(id: number, input: Partial<Marketplace>): Promise<Marketplace> {
    return this.prisma.marketplace.update({ where: { id }, data: { name: input.name, description: input.description, price: input.price } });
  }
  async findOne(id: number): Promise<Marketplace> {
    return this.prisma.marketplace.findUnique({ where: { id } });
  }
  async findAll(): Promise<Marketplace[]> {
    return this.prisma.marketplace.findMany();
  }

  /**
   * Remove a marketplace item by its ID. Returns true if removed,
   * otherwise false.
   */
  async delete(id: number): Promise<boolean> {
    await this.prisma.marketplace.delete({ where: { id } });
    return true;
  }
}
