import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma, PointEvent, UserBadge, Streak, VipTier, Referral } from '@prisma/client';

/**
 * Points, badges, streaks, VIP tiers, referrals and commissions — folded from
 * services/rewards-service (the only Prisma-backed implementation among the
 * four gamification services; vip-service and affiliate-service were
 * in-memory stubs subsumed by VipTier/Referral/Commission). Typed port with
 * the injected PrismaService; duplicate-swallowing catches now rethrow
 * anything that is not a unique violation.
 */

export interface MyRewards {
  points: number;
  events: PointEvent[];
  badges: UserBadge[];
  streaks: Streak[];
}

export interface VipStatus {
  points: number;
  tier: VipTier | null;
  next: VipTier | null;
}

function isUniqueViolation(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002';
}

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async myRewards(userId: number): Promise<MyRewards> {
    const events = await this.prisma.pointEvent.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    const points = events.reduce((s, e) => s + e.amount, 0);
    const badges = await this.prisma.userBadge.findMany({ where: { userId } });
    const streaks = await this.prisma.streak.findMany({ where: { userId } });
    return { points, events, badges, streaks };
  }

  async myVipStatus(userId: number): Promise<VipStatus> {
    const events = await this.prisma.pointEvent.findMany({ where: { userId } });
    const points = events.reduce((s, e) => s + e.amount, 0);
    const tiers = await this.prisma.vipTier.findMany({ orderBy: { threshold: 'asc' } });
    const tier = [...tiers].reverse().find((t) => points >= t.threshold) ?? null;
    const next = tiers.find((t) => !tier || t.threshold > tier.threshold) ?? null;
    return { points, tier, next };
  }

  /** Idempotent point ingestion; SESSION_COMPLETED also bumps the workout streak. */
  async ingestEvent(userId: number, type: string, amount: number, meta: Prisma.InputJsonValue | undefined, key: string): Promise<{ ok: true; duplicate?: true }> {
    if (!key) throw new BadRequestException('IDEMPOTENCY_REQUIRED');
    let duplicate = false;
    try {
      await this.prisma.pointEvent.create({ data: { userId, type, amount, meta, idempotencyKey: key } });
    } catch (e) {
      if (!isUniqueViolation(e)) throw e;
      duplicate = true;
    }
    if (!duplicate && type === 'SESSION_COMPLETED') {
      await this.prisma.streak.upsert({
        where: { userId_kind: { userId, kind: 'workout' } },
        update: { count: { increment: 1 }, lastDate: new Date() },
        create: { userId, kind: 'workout', count: 1, lastDate: new Date() },
      });
    }
    return duplicate ? { ok: true, duplicate: true } : { ok: true };
  }

  async claimBadge(userId: number, badgeId: number): Promise<{ ok: true }> {
    const badge = await this.prisma.badge.findUnique({ where: { id: badgeId } });
    if (!badge) throw new BadRequestException('BADGE_NOT_FOUND');
    try {
      await this.prisma.userBadge.create({ data: { userId, badgeId } });
    } catch (e) {
      if (!isUniqueViolation(e)) throw e; // already claimed -> idempotent ok
    }
    return { ok: true };
  }

  /** One referral code per inviter (returns the existing one when present). */
  async createReferral(inviterId: number): Promise<Referral> {
    const existing = await this.prisma.referral.findFirst({ where: { inviterId } });
    if (existing) return existing;
    const code = 'R' + Math.random().toString(36).slice(2, 8).toUpperCase();
    return this.prisma.referral.create({ data: { code, inviterId } });
  }

  async useReferral(code: string, inviteeId: number): Promise<{ ok: true }> {
    const ref = await this.prisma.referral.findUnique({ where: { code } });
    if (!ref) throw new BadRequestException('REFERRAL_NOT_FOUND');
    if (ref.inviterId === inviteeId) throw new BadRequestException('SELF_REFERRAL_BLOCKED');
    try {
      await this.prisma.referralUse.create({ data: { code, inviterId: ref.inviterId, inviteeId } });
    } catch (e) {
      if (!isUniqueViolation(e)) throw e; // same invitee reusing the code -> no double reward
      return { ok: true };
    }
    await this.ingestEvent(ref.inviterId, 'REFERRAL_COMPLETED', 100, { inviteeId }, `ref-${code}-${inviteeId}`);
    await this.prisma.commission.create({ data: { inviterId: ref.inviterId, amount: 500, status: 'pending' } });
    return { ok: true };
  }

  async payoutCommission(inviterId: number): Promise<{ paid: number }> {
    const pending = await this.prisma.commission.findMany({ where: { inviterId, status: 'pending' } });
    const amount = pending.reduce((s, c) => s + c.amount, 0);
    if (amount <= 0) return { paid: 0 };
    await this.prisma.commission.updateMany({ where: { inviterId, status: 'pending' }, data: { status: 'paid' } });
    return { paid: amount };
  }
}
