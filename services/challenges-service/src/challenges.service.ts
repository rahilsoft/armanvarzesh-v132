
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ChallengesService {
  private prisma = new PrismaClient();

  async listActive(now = new Date()) {
    const items = await this.prisma.challenge.findMany({
      where: { startAt: { lte: now }, endAt: { gte: now } },
      orderBy: { startAt: 'asc' },
    });
    return { items };
  }

  async join(challengeId: number, userId: number) {
    const c = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!c) return { ok: false, error: 'not_found' };
    const p = await this.prisma.challengeParticipant.upsert({
      where: { challengeId_userId: { challengeId, userId } },
      update: { status: 'joined' },
      create: { challengeId, userId, status: 'joined', progress: {} },
    });
    return { ok: true, participant: p };
  }

  async complete(challengeId: number, userId: number) {
    const p = await this.prisma.challengeParticipant.update({
      where: { challengeId_userId: { challengeId, userId } },
      data: { status: 'completed', completedAt: new Date() },
    });
    return { ok: true, participant: p };
  }
}
