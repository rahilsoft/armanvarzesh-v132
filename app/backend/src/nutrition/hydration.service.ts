import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { HydrationLog } from '@prisma/client';

export interface HydrationRange {
  userId: number;
  from: Date;
  to: Date;
  totalMl: number;
  items: HydrationLog[];
}

/** Hydration tracking (folded from services/nutrition-service). */
@Injectable()
export class HydrationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: { userId: number; occurredAt: Date; ml: number; source?: string }): Promise<HydrationLog> {
    return this.prisma.hydrationLog.create({
      data: {
        userId: input.userId,
        occurredAt: input.occurredAt,
        ml: input.ml,
        source: input.source ?? 'manual',
      },
    });
  }

  async getRange(userId: number, from: Date, to: Date): Promise<HydrationRange> {
    const items = await this.prisma.hydrationLog.findMany({
      where: { userId, occurredAt: { gte: from, lte: to } },
      orderBy: { occurredAt: 'asc' },
    });
    const totalMl = items.reduce((s, x) => s + x.ml, 0);
    return { userId, from, to, totalMl, items };
  }
}
