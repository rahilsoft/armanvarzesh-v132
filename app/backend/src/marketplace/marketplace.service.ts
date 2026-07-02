import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Marketplace } from '@prisma/client';

/** Writable marketplace-item fields (folded from services/marketplace-service,
 *  which was an in-memory stub without a schema). Purchases are NOT modelled
 *  here — they go through the canonical Payments Product/Order flow. */
export interface MarketplaceWriteInput {
  name?: string;
  description?: string;
  price?: number;
  type?: string;
  createdBy?: number;
}

function pickFields(input: MarketplaceWriteInput): MarketplaceWriteInput {
  const out: MarketplaceWriteInput = {};
  const keys: (keyof MarketplaceWriteInput)[] = ['name', 'description', 'price', 'type', 'createdBy'];
  for (const k of keys) if (input[k] !== undefined) (out as Record<string, unknown>)[k] = input[k];
  return out;
}

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  async create(input: MarketplaceWriteInput & { name: string; description: string; price: number }): Promise<Marketplace> {
    return this.prisma.marketplace.create({
      data: { ...pickFields(input), name: input.name, description: input.description, price: input.price, createdAt: new Date() },
    });
  }

  async update(id: number, input: MarketplaceWriteInput): Promise<Marketplace> {
    const existing = await this.prisma.marketplace.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('ITEM_NOT_FOUND');
    return this.prisma.marketplace.update({ where: { id }, data: pickFields(input) });
  }

  async findOne(id: number): Promise<Marketplace | null> {
    return this.prisma.marketplace.findUnique({ where: { id } });
  }

  async findAll(type?: string): Promise<Marketplace[]> {
    return this.prisma.marketplace.findMany({ where: type ? { type } : {} });
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
