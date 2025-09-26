
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class InboxService {
  private prisma = new PrismaClient();

  async list(userId: number, limit = 20, cursor?: number) {
    const where = { userId };
    const items = await this.prisma.notificationInbox.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });
    const nextCursor = items.length ? items[items.length - 1].id : null;
    return { items, nextCursor };
  }

  async markRead(userId: number, id: number) {
    const rec = await this.prisma.notificationInbox.update({
      where: { id },
      data: { readAt: new Date() },
    });
    if (rec.userId !== userId) return { ok: false, error: 'forbidden' };
    return { ok: true, id, readAt: rec.readAt };
  }
}
