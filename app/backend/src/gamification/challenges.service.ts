import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma, Challenge, ChallengeParticipant } from '@prisma/client';

/**
 * Windowed challenges with participants and a per-challenge leaderboard.
 * Folded from services/challenges-service: its Prisma schema carried the
 * right shape (rules/reward/startAt/endAt, participant progress) but its
 * actual service was an in-memory stub that never touched those models —
 * this is the real database-backed implementation of that contract.
 */

export interface CreateChallengeInput {
  name: string;
  description: string;
  startAt: Date;
  endAt: Date;
  rules?: Prisma.InputJsonValue;
  reward?: Prisma.InputJsonValue;
}

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  createChallenge(input: CreateChallengeInput): Promise<Challenge> {
    const duration = Math.max(1, Math.ceil((input.endAt.getTime() - input.startAt.getTime()) / 86_400_000));
    return this.prisma.challenge.create({
      data: {
        name: input.name,
        description: input.description,
        duration, // legacy column kept in sync for pre-fold readers
        rules: input.rules,
        reward: input.reward,
        startAt: input.startAt,
        endAt: input.endAt,
      },
    });
  }

  listChallenges(activeAt?: Date): Promise<Challenge[]> {
    const where = activeAt ? { startAt: { lte: activeAt }, endAt: { gte: activeAt } } : {};
    return this.prisma.challenge.findMany({ where, orderBy: { startAt: 'desc' } });
  }

  /** Idempotent join: re-joining returns the existing entry. */
  async joinChallenge(challengeId: number, userId: number): Promise<ChallengeParticipant> {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('CHALLENGE_NOT_FOUND');
    return this.prisma.challengeParticipant.upsert({
      where: { challengeId_userId: { challengeId, userId } },
      update: {},
      create: { challengeId, userId },
    });
  }

  async addPoints(challengeId: number, userId: number, points: number, progress?: Prisma.InputJsonValue): Promise<ChallengeParticipant> {
    const entry = await this.prisma.challengeParticipant.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
    });
    if (!entry) throw new NotFoundException('NOT_A_PARTICIPANT');
    return this.prisma.challengeParticipant.update({
      where: { id: entry.id },
      data: { points: { increment: points }, ...(progress !== undefined ? { progress } : {}) },
    });
  }

  async complete(challengeId: number, userId: number): Promise<ChallengeParticipant> {
    const entry = await this.prisma.challengeParticipant.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
    });
    if (!entry) throw new NotFoundException('NOT_A_PARTICIPANT');
    return this.prisma.challengeParticipant.update({
      where: { id: entry.id },
      data: { status: 'completed', completedAt: new Date() },
    });
  }

  leaderboard(challengeId: number, take = 50): Promise<ChallengeParticipant[]> {
    return this.prisma.challengeParticipant.findMany({
      where: { challengeId },
      orderBy: { points: 'desc' },
      take,
    });
  }
}
