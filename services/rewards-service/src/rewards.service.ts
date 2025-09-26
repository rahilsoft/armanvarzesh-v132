import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

function uid(): string { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8); return v.toString(16);
});}

@Injectable()
export class RewardsService {
  private prisma = new PrismaClient();

  async myRewards(userId: string){
    const events = await this.prisma.pointEvent.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    const total = events.reduce((s,e)=> s+e.amount, 0);
    const badges = await this.prisma.userBadge.findMany({ where: { userId } });
    const streaks = await this.prisma.streak.findMany({ where: { userId } });
    return { points: total, events, badges, streaks };
  }

  async myVipStatus(userId: string){
    const events = await this.prisma.pointEvent.findMany({ where: { userId } });
    const total = events.reduce((s,e)=> s+e.amount, 0);
    const tiers = await this.prisma.vipTier.findMany({ orderBy: { threshold: 'asc' } });
    const tier = [...tiers].reverse().find(t => total >= t.threshold) || null;
    const next = tiers.find(t => !tier || t.threshold > (tier?.threshold||0)) || null;
    return { points: total, tier, next };
  }

  async createReferral(userId: string){
    const existing = await this.prisma.referral.findFirst({ where:{ inviterId: userId } });
    if (existing) return existing;
    const code = 'R'+Math.random().toString(36).slice(2,8).toUpperCase();
    return this.prisma.referral.create({ data: { id: uid(), code, inviterId: userId } });
  }

  async payoutCommission(inviterId: string){
    const pending = await this.prisma.commission.findMany({ where: { inviterId, status: 'pending' } });
    const amount = pending.reduce((s,c)=> s+c.amount, 0);
    if (amount<=0) return { paid: 0 };
    await this.prisma.commission.updateMany({ where: { inviterId, status: 'pending' }, data: { status: 'paid' } });
    return { paid: amount };
  }

  async claimBadge(userId: string, badgeId: string){
    const badge = await this.prisma.badge.findUnique({ where: { id: badgeId } });
    if (!badge) throw new BadRequestException('BADGE_NOT_FOUND');
    try { await this.prisma.userBadge.create({ data: { id: uid(), userId, badgeId } }); } catch {}
    return { ok: true };
  }

  async ingestEvent(userId: string, type: string, amount: number, meta: any, key: string){
    if (!key) throw new BadRequestException('IDEMPOTENCY_REQUIRED');
    try { await this.prisma.pointEvent.create({ data: { id: uid(), userId, type, amount, meta, idempotencyKey: key } }); } catch {}
    if (type === 'SESSION_COMPLETED'){
      await this.prisma.streak.upsert({
        where: { userId_kind: { userId, kind: 'workout' } },
        update: { count: { increment: 1 }, lastDate: new Date() },
        create: { id: uid(), userId, kind: 'workout', count: 1, lastDate: new Date() }
      });
    }
    return { ok: true };
  }

  async useReferral(code: string, inviteeId: string){
    const ref = await this.prisma.referral.findUnique({ where: { code } });
    if (!ref) throw new BadRequestException('REFERRAL_NOT_FOUND');
    if (ref.inviterId === inviteeId) throw new BadRequestException('SELF_REFERRAL_BLOCKED');
    try { await this.prisma.referralUse.create({ data: { id: uid(), code, inviterId: ref.inviterId, inviteeId } }); } catch {}
    await this.ingestEvent(ref.inviterId, 'REFERRAL_COMPLETED', 100, { inviteeId }, `ref-${code}-${inviteeId}`);
    await this.prisma.commission.create({ data: { id: uid(), inviterId: ref.inviterId, amount: 500, status: 'pending' } });
    return { ok: true };
  }
}
