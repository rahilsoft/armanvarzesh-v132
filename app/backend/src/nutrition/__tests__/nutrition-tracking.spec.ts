import { NotFoundException } from '@nestjs/common';
import { NutritionGoalsService } from '../goals.service';
import { HydrationService } from '../hydration.service';
import { HabitsService } from '../habits.service';

/**
 * Nutrition domain fold: verifies the goals/hydration/habits capability
 * ported from services/nutrition-service. Prisma is an in-memory mock;
 * integration/E2E against real Postgres run in CI.
 */
function makePrismaMock() {
  const goals: any[] = [];
  const hydration: any[] = [];
  const habits: any[] = [];
  const habitLogs: any[] = [];
  let seq = 1;

  return {
    _goals: goals, _hydration: hydration, _habits: habits, _habitLogs: habitLogs,
    nutritionGoal: {
      upsert: async ({ where, update, create }: any) => {
        let g = goals.find((x) => x.userId === where.userId);
        if (g) Object.assign(g, update); else { g = { id: seq++, createdAt: new Date(), ...create }; goals.push(g); }
        return g;
      },
      findUnique: async ({ where }: any) => goals.find((x) => x.userId === where.userId) ?? null,
    },
    hydrationLog: {
      create: async ({ data }: any) => { const r = { id: seq++, createdAt: new Date(), ...data }; hydration.push(r); return r; },
      findMany: async ({ where }: any) => hydration
        .filter((x) => x.userId === where.userId && x.occurredAt >= where.occurredAt.gte && x.occurredAt <= where.occurredAt.lte)
        .sort((a, b) => a.occurredAt - b.occurredAt),
    },
    habit: {
      create: async ({ data }: any) => { const h = { id: seq++, active: true, createdAt: new Date(), ...data }; habits.push(h); return h; },
      findUnique: async ({ where }: any) => habits.find((h) => h.id === where.id) ?? null,
      findMany: async ({ where }: any) => habits.filter((h) => h.userId === where.userId && h.active === where.active),
    },
    habitLog: {
      create: async ({ data, include }: any) => {
        const l = { id: seq++, createdAt: new Date(), ...data };
        habitLogs.push(l);
        return include?.habit ? { ...l, habit: habits.find((h) => h.id === l.habitId) } : l;
      },
      findMany: async ({ where }: any) => habitLogs
        .filter((l) => where.habitId.in.includes(l.habitId) && l.occurredAt >= where.occurredAt.gte && l.occurredAt <= where.occurredAt.lte)
        .sort((a, b) => a.occurredAt - b.occurredAt),
    },
  };
}

describe('NutritionGoalsService (Nutrition fold)', () => {
  it('upserts a single goal per user and reads it back', async () => {
    const prisma = makePrismaMock();
    const svc = new NutritionGoalsService(prisma as any);
    await svc.setGoal({ userId: 7, calories: 2200, protein: 160, carbs: 220, fats: 70 });
    await svc.setGoal({ userId: 7, calories: 2000, protein: 150, carbs: 200, fats: 65 });
    expect(prisma._goals).toHaveLength(1); // upsert, not duplicate
    const g = await svc.getGoal(7);
    expect(g).toMatchObject({ userId: 7, calories: 2000, protein: 150 });
  });
});

describe('HydrationService (Nutrition fold)', () => {
  it('logs intake (default source manual) and sums a range', async () => {
    const prisma = makePrismaMock();
    const svc = new HydrationService(prisma as any);
    const day = (h: number) => new Date(Date.UTC(2026, 6, 2, h));
    await svc.create({ userId: 3, occurredAt: day(8), ml: 300 });
    await svc.create({ userId: 3, occurredAt: day(12), ml: 500, source: 'healthkit' });
    await svc.create({ userId: 9, occurredAt: day(9), ml: 999 }); // other user
    const range = await svc.getRange(3, day(0), day(23));
    expect(range.totalMl).toBe(800);
    expect(range.items).toHaveLength(2);
    expect(prisma._hydration[0].source).toBe('manual');
  });
});

describe('HabitsService (Nutrition fold)', () => {
  it('creates a habit, logs values, and reports today progress capped at 1', async () => {
    const prisma = makePrismaMock();
    const svc = new HabitsService(prisma as any);
    const now = new Date();
    const habit = await svc.createHabit({ userId: 5, type: 'water' as any, target: 2000, cadence: { daily: true }, tz: 'UTC' });
    await svc.logHabit({ habitId: habit.id, occurredAt: now, value: 1500 });
    await svc.logHabit({ habitId: habit.id, occurredAt: now, value: 1000 });
    const today = await svc.getToday(5, now);
    expect(today.items).toHaveLength(1);
    expect(today.items[0].sum).toBe(2500);
    expect(today.items[0].progress).toBe(1); // capped
    expect(today.items[0].logs).toHaveLength(2);
  });

  it('rejects logging against a non-existent habit', async () => {
    const prisma = makePrismaMock();
    const svc = new HabitsService(prisma as any);
    await expect(svc.logHabit({ habitId: 404, occurredAt: new Date(), value: 1 }))
      .rejects.toBeInstanceOf(NotFoundException);
  });

  it('excludes logs outside the local-day window from today', async () => {
    const prisma = makePrismaMock();
    const svc = new HabitsService(prisma as any);
    const now = new Date();
    const yesterday = new Date(now.getTime() - 26 * 60 * 60 * 1000);
    const habit = await svc.createHabit({ userId: 6, type: 'steps' as any, target: 10000, cadence: { daily: true }, tz: 'UTC' });
    await svc.logHabit({ habitId: habit.id, occurredAt: yesterday, value: 9999 });
    await svc.logHabit({ habitId: habit.id, occurredAt: now, value: 4000 });
    const today = await svc.getToday(6, now);
    expect(today.items[0].sum).toBe(4000);
    expect(today.items[0].progress).toBeCloseTo(0.4);
  });
});
