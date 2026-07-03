import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RewardsService } from '../rewards.service';
import { ChallengesService } from '../challenges.service';

/**
 * Gamification fold: verifies points idempotency, streaks, VIP tier
 * computation, referral/commission flow and DB-backed challenges. Prisma is
 * an in-memory mock (unique violations raised as P2002 like the real client);
 * integration/E2E against real Postgres run in CI.
 */
function p2002() {
  return new Prisma.PrismaClientKnownRequestError('unique', { code: 'P2002', clientVersion: 'test' });
}

function makePrismaMock() {
  const db: Record<string, any[]> = {
    pointEvent: [], badge: [], userBadge: [], streak: [], vipTier: [],
    referral: [], referralUse: [], commission: [], challenge: [], challengeParticipant: [],
  };
  let seq = 1;
  const row = (data: any) => ({ id: seq++, createdAt: new Date(), ...data });

  return {
    _db: db,
    pointEvent: {
      create: async ({ data }: any) => {
        if (db.pointEvent.some((e) => e.idempotencyKey === data.idempotencyKey)) throw p2002();
        const r = row(data); db.pointEvent.push(r); return r;
      },
      findMany: async ({ where }: any) => db.pointEvent.filter((e) => e.userId === where.userId),
    },
    badge: {
      findUnique: async ({ where }: any) => db.badge.find((b) => b.id === where.id) ?? null,
      create: async ({ data }: any) => { const r = row(data); db.badge.push(r); return r; },
    },
    userBadge: {
      create: async ({ data }: any) => {
        if (db.userBadge.some((u) => u.userId === data.userId && u.badgeId === data.badgeId)) throw p2002();
        const r = row(data); db.userBadge.push(r); return r;
      },
      findMany: async ({ where }: any) => db.userBadge.filter((u) => u.userId === where.userId),
    },
    streak: {
      upsert: async ({ where, update, create }: any) => {
        const { userId, kind } = where.userId_kind;
        let s = db.streak.find((x) => x.userId === userId && x.kind === kind);
        if (s) { s.count += update.count.increment; s.lastDate = update.lastDate; }
        else { s = row(create); db.streak.push(s); }
        return s;
      },
      findMany: async ({ where }: any) => db.streak.filter((s) => s.userId === where.userId),
    },
    vipTier: { findMany: async () => [...db.vipTier].sort((a, b) => a.threshold - b.threshold) },
    referral: {
      findFirst: async ({ where }: any) => db.referral.find((r) => r.inviterId === where.inviterId) ?? null,
      findUnique: async ({ where }: any) => db.referral.find((r) => r.code === where.code) ?? null,
      create: async ({ data }: any) => { const r = row(data); db.referral.push(r); return r; },
    },
    referralUse: {
      create: async ({ data }: any) => {
        if (db.referralUse.some((u) => u.code === data.code && u.inviteeId === data.inviteeId)) throw p2002();
        const r = row(data); db.referralUse.push(r); return r;
      },
    },
    commission: {
      create: async ({ data }: any) => { const r = row(data); db.commission.push(r); return r; },
      findMany: async ({ where }: any) => db.commission.filter((c) => c.inviterId === where.inviterId && c.status === where.status),
      updateMany: async ({ where, data }: any) => {
        let n = 0;
        for (const c of db.commission) if (c.inviterId === where.inviterId && c.status === where.status) { Object.assign(c, data); n++; }
        return { count: n };
      },
    },
    challenge: {
      create: async ({ data }: any) => { const r = row(data); db.challenge.push(r); return r; },
      findUnique: async ({ where }: any) => db.challenge.find((c) => c.id === where.id) ?? null,
      findMany: async () => db.challenge,
    },
    challengeParticipant: {
      upsert: async ({ where, create }: any) => {
        const { challengeId, userId } = where.challengeId_userId;
        let e = db.challengeParticipant.find((x) => x.challengeId === challengeId && x.userId === userId);
        if (!e) { e = row({ status: 'joined', points: 0, ...create }); db.challengeParticipant.push(e); }
        return e;
      },
      findUnique: async ({ where }: any) => {
        const { challengeId, userId } = where.challengeId_userId;
        return db.challengeParticipant.find((x) => x.challengeId === challengeId && x.userId === userId) ?? null;
      },
      update: async ({ where, data }: any) => {
        const e = db.challengeParticipant.find((x) => x.id === where.id);
        if (data.points?.increment) e.points += data.points.increment;
        for (const k of ['status', 'completedAt', 'progress']) if (data[k] !== undefined) e[k] = data[k];
        return e;
      },
      findMany: async ({ where, take }: any) => db.challengeParticipant
        .filter((x) => x.challengeId === where.challengeId)
        .sort((a, b) => b.points - a.points)
        .slice(0, take ?? 50),
    },
  };
}

describe('RewardsService (Gamification fold)', () => {
  it('ingests points idempotently and bumps the workout streak once', async () => {
    const prisma = makePrismaMock();
    const svc = new RewardsService(prisma as any);
    await svc.ingestEvent(1, 'SESSION_COMPLETED', 10, undefined, 'k-1');
    const dup = await svc.ingestEvent(1, 'SESSION_COMPLETED', 10, undefined, 'k-1');
    expect(dup.duplicate).toBe(true);
    const me = await svc.myRewards(1);
    expect(me.points).toBe(10);
    expect(me.streaks[0]).toMatchObject({ kind: 'workout', count: 1 }); // not double-bumped
  });

  it('computes VIP tier and the next threshold', async () => {
    const prisma = makePrismaMock();
    prisma._db.vipTier.push({ id: 90, name: 'Silver', threshold: 100 }, { id: 91, name: 'Gold', threshold: 500 });
    const svc = new RewardsService(prisma as any);
    await svc.ingestEvent(2, 'X', 150, undefined, 'k-a');
    const vip = await svc.myVipStatus(2);
    expect(vip.tier?.name).toBe('Silver');
    expect(vip.next?.name).toBe('Gold');
  });

  it('referral flow: one code per inviter, self-referral blocked, invitee counted once, commission paid out', async () => {
    const prisma = makePrismaMock();
    const svc = new RewardsService(prisma as any);
    const ref = await svc.createReferral(5);
    expect((await svc.createReferral(5)).code).toBe(ref.code); // stable
    await expect(svc.useReferral(ref.code, 5)).rejects.toBeInstanceOf(BadRequestException); // self
    await svc.useReferral(ref.code, 6);
    await svc.useReferral(ref.code, 6); // duplicate invitee — no double reward
    expect(prisma._db.commission).toHaveLength(1);
    expect((await svc.myRewards(5)).points).toBe(100);
    expect(await svc.payoutCommission(5)).toEqual({ paid: 500 });
    expect(await svc.payoutCommission(5)).toEqual({ paid: 0 }); // nothing pending
  });

  it('claims a badge idempotently and rejects unknown badges', async () => {
    const prisma = makePrismaMock();
    prisma._db.badge.push({ id: 70, key: 'first', name: 'First!' });
    const svc = new RewardsService(prisma as any);
    await svc.claimBadge(1, 70);
    await svc.claimBadge(1, 70);
    expect(prisma._db.userBadge).toHaveLength(1);
    await expect(svc.claimBadge(1, 999)).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe('ChallengesService (Gamification fold)', () => {
  const day = 86_400_000;
  it('creates a windowed challenge (legacy duration kept in sync) and runs a leaderboard', async () => {
    const prisma = makePrismaMock();
    const svc = new ChallengesService(prisma as any);
    const ch = await svc.createChallenge({ name: '30d', description: 'push', startAt: new Date(Date.now()), endAt: new Date(Date.now() + 30 * day) });
    expect(ch.duration).toBe(30);
    await svc.joinChallenge(ch.id, 1);
    await svc.joinChallenge(ch.id, 2);
    await svc.joinChallenge(ch.id, 1); // idempotent
    await svc.addPoints(ch.id, 1, 50);
    await svc.addPoints(ch.id, 2, 80);
    await svc.addPoints(ch.id, 1, 10);
    const board = await svc.leaderboard(ch.id);
    expect(board.map((e) => [e.userId, e.points])).toEqual([[2, 80], [1, 60]]);
  });

  it('rejects joining a missing challenge and points for non-participants', async () => {
    const prisma = makePrismaMock();
    const svc = new ChallengesService(prisma as any);
    await expect(svc.joinChallenge(404, 1)).rejects.toBeInstanceOf(NotFoundException);
    const ch = await svc.createChallenge({ name: 'x', description: '', startAt: new Date(), endAt: new Date(Date.now() + day) });
    await expect(svc.addPoints(ch.id, 99, 5)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('marks completion with a timestamp', async () => {
    const prisma = makePrismaMock();
    const svc = new ChallengesService(prisma as any);
    const ch = await svc.createChallenge({ name: 'c', description: '', startAt: new Date(), endAt: new Date(Date.now() + day) });
    await svc.joinChallenge(ch.id, 3);
    const done = await svc.complete(ch.id, 3);
    expect(done.status).toBe('completed');
    expect(done.completedAt).toBeInstanceOf(Date);
  });
});
