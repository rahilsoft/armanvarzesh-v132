
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class HydrationService {
  private prisma = new PrismaClient();
  async create(input: { userId: number; occurredAt: Date; ml: number; source?: string }) {
    const rec = await this.prisma.hydrationLog.create({ data: {
      userId: input.userId,
      occurredAt: input.occurredAt,
      ml: input.ml,
      source: input.source ?? 'manual',
    }});
    return { ok: true, record: rec };
  }
  async getRange(userId: number, from: Date, to: Date) {
    const items = await this.prisma.hydrationLog.findMany({
      where: { userId, occurredAt: { gte: from, lte: to } },
      orderBy: { occurredAt: 'asc' },
    });
    const totalMl = items.reduce((s, x) => s + x.ml, 0);
    return { userId, from, to, totalMl, items };
  }
}
