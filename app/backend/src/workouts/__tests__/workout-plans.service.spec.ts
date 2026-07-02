import { NotFoundException } from '@nestjs/common';
import { WorkoutPlansService } from '../workout-plans.service';
import { WorkoutsService } from '../workouts.service';

/**
 * Workout domain fold: verifies the plan/exercise/progress logic ported from
 * services/workouts-service, and that WorkoutsService now persists structured
 * columns (pre-fold it stuffed them into the `data` JSON blob). Prisma is an
 * in-memory mock; integration/E2E against real Postgres run in CI.
 */
function makePrismaMock() {
  const plans: any[] = [];
  const exercises: any[] = [];
  const workouts: any[] = [];
  let seq = 1;

  return {
    _plans: plans, _exercises: exercises, _workouts: workouts,
    workoutPlan: {
      findMany: async () => plans.map((p) => ({ ...p, exercises: exercises.filter((e) => e.planId === p.id), workouts: workouts.filter((w) => w.planId === p.id) })),
      findUnique: async ({ where }: any) => plans.find((p) => p.id === where.id) ?? null,
      create: async ({ data }: any) => { const p = { id: seq++, createdAt: new Date(), ...data }; plans.push(p); return p; },
      update: async ({ where, data }: any) => { const p = plans.find((x) => x.id === where.id); Object.assign(p, data); return p; },
      delete: async ({ where }: any) => {
        const i = plans.findIndex((p) => p.id === where.id);
        const [gone] = plans.splice(i, 1);
        // emulate FK onDelete: Cascade for exercises, SetNull for workouts
        for (let j = exercises.length - 1; j >= 0; j--) if (exercises[j].planId === gone.id) exercises.splice(j, 1);
        for (const w of workouts) if (w.planId === gone.id) w.planId = null;
        return gone;
      },
    },
    exercise: {
      findMany: async ({ where, take }: any) => {
        let rows = exercises;
        if (where?.planId !== undefined) rows = rows.filter((e) => e.planId === where.planId);
        if (where?.name?.contains) rows = rows.filter((e) => e.name.toLowerCase().includes(where.name.contains.toLowerCase()));
        return take ? rows.slice(0, take) : rows;
      },
      create: async ({ data }: any) => { const e = { id: seq++, createdAt: new Date(), ...data }; exercises.push(e); return e; },
      update: async ({ where, data }: any) => { const e = exercises.find((x) => x.id === where.id); Object.assign(e, data); return e; },
      delete: async ({ where }: any) => { const i = exercises.findIndex((e) => e.id === where.id); return exercises.splice(i, 1)[0]; },
    },
    workout: {
      findMany: async ({ where }: any = {}) => (where?.userId !== undefined ? workouts.filter((w) => w.userId === where.userId) : workouts),
      create: async ({ data }: any) => { const w = { id: seq++, createdAt: new Date(), ...data }; workouts.push(w); return w; },
      update: async ({ where, data }: any) => { const w = workouts.find((x) => x.id === where.id); Object.assign(w, data); return w; },
      findUniqueOrThrow: async ({ where }: any) => { const w = workouts.find((x) => x.id === where.id); if (!w) throw new Error('not found'); return w; },
      delete: async ({ where }: any) => { const i = workouts.findIndex((w) => w.id === where.id); return workouts.splice(i, 1)[0]; },
    },
  };
}

describe('WorkoutPlansService (Workout domain fold)', () => {
  it('creates a plan and adds exercises to it', async () => {
    const prisma = makePrismaMock();
    const svc = new WorkoutPlansService(prisma as any);
    const plan = await svc.createPlan({ name: 'Push/Pull', description: '4-week block', userId: 1 });
    await svc.createExercise({ planId: plan.id, name: 'Bench Press', sets: 5, reps: 5, weight: 80 });
    await svc.createExercise({ planId: plan.id, name: 'Barbell Row', sets: 5, reps: 5, weight: 70, restTime: 120 });
    const listed = await svc.findExercisesByPlan(plan.id);
    expect(listed).toHaveLength(2);
    expect(listed[0].name).toBe('Bench Press');
  });

  it('rejects an exercise for a non-existent plan', async () => {
    const prisma = makePrismaMock();
    const svc = new WorkoutPlansService(prisma as any);
    await expect(svc.createExercise({ planId: 999, name: 'Ghost' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('searches exercises case-insensitively', async () => {
    const prisma = makePrismaMock();
    const svc = new WorkoutPlansService(prisma as any);
    const plan = await svc.createPlan({ name: 'P' });
    await svc.createExercise({ planId: plan.id, name: 'Overhead Press' });
    await svc.createExercise({ planId: plan.id, name: 'Deadlift' });
    const hits = await svc.searchExercises('press');
    expect(hits).toHaveLength(1);
    expect(hits[0].name).toBe('Overhead Press');
  });

  it('deleting a plan cascades exercises and nulls workout links (FK semantics)', async () => {
    const prisma = makePrismaMock();
    const svc = new WorkoutPlansService(prisma as any);
    const wsvc = new WorkoutsService(prisma as any);
    const plan = await svc.createPlan({ name: 'Doomed' });
    await svc.createExercise({ planId: plan.id, name: 'Squat' });
    const w = await wsvc.create({ title: 'Day 1', planId: plan.id, userId: 5 });
    await svc.deletePlan(plan.id);
    expect(prisma._exercises).toHaveLength(0);
    expect(prisma._workouts.find((x: any) => x.id === w.id).planId).toBeNull();
  });

  it('aggregates user progress: volume = sets*reps*weight, averageRpe over rated sessions', async () => {
    const prisma = makePrismaMock();
    const svc = new WorkoutPlansService(prisma as any);
    const wsvc = new WorkoutsService(prisma as any);
    await wsvc.create({ title: 'A', userId: 9, sets: 5, reps: 5, weight: 100, rpe: 8 });   // vol 2500
    await wsvc.create({ title: 'B', userId: 9, sets: 3, reps: 10, weight: 50, rpe: 7 });   // vol 1500
    await wsvc.create({ title: 'C', userId: 9, sets: 4, reps: 8 });                         // no weight -> 0, no rpe
    await wsvc.create({ title: 'other user', userId: 2, sets: 10, reps: 10, weight: 100 });
    const p = await svc.getProgressByUser(9);
    expect(p.totalWorkouts).toBe(3);
    expect(p.totalVolume).toBe(4000);
    expect(p.averageRpe).toBe(7.5);
  });

  it('returns null averageRpe when no session has an RPE', async () => {
    const prisma = makePrismaMock();
    const svc = new WorkoutPlansService(prisma as any);
    const wsvc = new WorkoutsService(prisma as any);
    await wsvc.create({ title: 'A', userId: 4, sets: 1, reps: 1, weight: 1 });
    const p = await svc.getProgressByUser(4);
    expect(p.averageRpe).toBeNull();
  });
});

describe('WorkoutsService (structured columns fix)', () => {
  it('persists structured fields as real columns, not inside the data blob', async () => {
    const prisma = makePrismaMock();
    const wsvc = new WorkoutsService(prisma as any);
    const w = await wsvc.create({ title: 'Leg day', userId: 3, sets: 4, reps: 12, weight: 60, rpe: 7.5, notes: 'felt strong' });
    expect(w).toMatchObject({ title: 'Leg day', userId: 3, sets: 4, reps: 12, weight: 60, rpe: 7.5, notes: 'felt strong' });
    expect(w.data).toBeUndefined(); // nothing smuggled into the JSON blob
  });

  it('never forwards unknown keys to Prisma', async () => {
    const prisma = makePrismaMock();
    const wsvc = new WorkoutsService(prisma as any);
    const w = await wsvc.create({ title: 'X', hacker: 'nope' } as any);
    expect((w as any).hacker).toBeUndefined();
  });

  it('logActual still merges into the legacy data blob', async () => {
    const prisma = makePrismaMock();
    const wsvc = new WorkoutsService(prisma as any);
    const w = await wsvc.create({ title: 'Y', data: { planned: true } });
    const updated = await wsvc.logActual(w.id, { sets: 3 });
    expect(updated.data).toEqual({ planned: true, actual: { sets: 3 } });
  });
});
