import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PlanEngineService, validateProtocolParams } from '../plan-engine.service';

/** Plan* engine fold: schedule generation (rest days + weekly cap + day
 *  cycling), clientId propagation (fixed bug), adherence math, set logging,
 *  protocol validation. */
function makePrismaMock() {
  const plans: any[] = [];
  const assignments: any[] = [];
  const sessions: any[] = [];
  const setLogs: any[] = [];
  const sets: any[] = [{ id: 900, itemId: 1, order: 0 }];
  let seq = 1;
  return {
    _plans: plans, _sessions: sessions, _setLogs: setLogs,
    plan: {
      create: async ({ data }: any) => {
        const days = (data.days?.create ?? []).map((d: any, i: number) => ({ id: seq++, order: d.order ?? i }));
        const p = { id: seq++, status: 'DRAFT', version: 1, ...data, days };
        plans.push(p); return p;
      },
      findUnique: async ({ where }: any) => plans.find((x) => x.id === where.id) ?? null,
      update: async ({ where, data }: any) => {
        const p = plans.find((x) => x.id === where.id);
        if (data.version?.increment) p.version += data.version.increment;
        if (data.status) p.status = data.status;
        return p;
      },
    },
    planAssignment: {
      create: async ({ data }: any) => { const a = { id: seq++, ...data }; assignments.push(a); return a; },
      update: async ({ where, data }: any) => { const a = assignments.find((x) => x.id === where.id); Object.assign(a, data); return a; },
    },
    planSession: {
      createMany: async ({ data }: any) => { for (const d of data) sessions.push({ id: seq++, status: 'SCHEDULED', ...d }); return { count: data.length }; },
      deleteMany: async ({ where }: any) => { for (let i = sessions.length - 1; i >= 0; i--) if (sessions[i].assignmentId === where.assignmentId) sessions.splice(i, 1); return {}; },
      findMany: async ({ where }: any) => sessions.filter((s) =>
        (where.assignmentId === undefined || s.assignmentId === where.assignmentId)
        && (where.clientId === undefined || s.clientId === where.clientId)
        && (!where.date || (s.date >= where.date.gte && s.date <= where.date.lte))),
      findUnique: async ({ where }: any) => sessions.find((s) => s.id === where.id) ?? null,
      update: async ({ where, data }: any) => { const s = sessions.find((x) => x.id === where.id); Object.assign(s, data); return s; },
      count: async ({ where }: any) => sessions.filter((s) =>
        s.clientId === where.clientId
        && (!where.status || s.status === where.status)
        && s.date >= where.date.gte && s.date <= where.date.lte).length,
    },
    planSet: { findUnique: async ({ where }: any) => sets.find((s) => s.id === where.id) ?? null },
    planSetLog: { create: async ({ data }: any) => { const l = { id: seq++, ...data }; setLogs.push(l); return l; } },
    planSessionNote: { create: async ({ data }: any) => ({ id: seq++, ...data }) },
  };
}

const monday = new Date(Date.UTC(2026, 6, 6)); // Mon 2026-07-06

async function seededPlan(svc: PlanEngineService) {
  return svc.createPlan({ title: 'PPL', days: [{ order: 0 }, { order: 1 }, { order: 2 }] });
}

describe('PlanEngineService (content dismemberment step 2)', () => {
  it('generates a schedule honoring rest days, weekly cap and day cycling — with clientId set', async () => {
    const prisma = makePrismaMock();
    const svc = new PlanEngineService(prisma as any);
    const plan = await seededPlan(svc);
    const res = await svc.assignPlan(plan.id, 42, monday, 3, ['Sun', 'Sat'], 13);
    expect(res.sessions.length).toBe(6); // 3/wk over ~2 weeks
    expect(res.sessions.every((s: any) => s.clientId === 42)).toBe(true); // fixed bug
    const days = res.sessions.map((s: any) => s.date.getUTCDay());
    expect(days).not.toContain(0); // Sun
    expect(days).not.toContain(6); // Sat
    expect(res.sessions.map((s: any) => s.dayIndex)).toEqual([0, 1, 2, 0, 1, 2]); // cycles plan days
  });

  it('rejects assignment of an empty or missing plan', async () => {
    const prisma = makePrismaMock();
    const svc = new PlanEngineService(prisma as any);
    await expect(svc.assignPlan(999, 1, monday, 3, [], 7)).rejects.toBeInstanceOf(NotFoundException);
    const empty = await svc.createPlan({ title: 'empty' });
    await expect(svc.assignPlan(empty.id, 1, monday, 3, [], 7)).rejects.toThrow('PLAN_HAS_NO_DAYS');
  });

  it('adherence counts scheduled vs completed for the client window', async () => {
    const prisma = makePrismaMock();
    const svc = new PlanEngineService(prisma as any);
    const plan = await seededPlan(svc);
    const res = await svc.assignPlan(plan.id, 7, monday, 2, ['Sun'], 6);
    await svc.completeSession(res.sessions[0].id);
    const adh = await svc.userAdherence(7, monday, new Date(monday.getTime() + 7 * 86400000));
    expect(adh.scheduled).toBe(2);
    expect(adh.completed).toBe(1);
    expect(adh.completionRate).toBe(0.5);
  });

  it('logs sets against valid session+set; completeSession is idempotent', async () => {
    const prisma = makePrismaMock();
    const svc = new PlanEngineService(prisma as any);
    const plan = await seededPlan(svc);
    const res = await svc.assignPlan(plan.id, 5, monday, 1, [], 3);
    const sid = res.sessions[0].id;
    await expect(svc.logSet(sid, 12345, 8)).rejects.toThrow('SET_NOT_FOUND');
    const log = await svc.logSet(sid, 900, 8, 60, 7.5);
    expect(log).toMatchObject({ actualReps: 8, actualWeight: 60, rpe: 7.5 });
    const done = await svc.completeSession(sid);
    expect((await svc.completeSession(sid)).completedAt).toEqual(done.completedAt);
  });

  it('validates protocol params and publish bumps version', async () => {
    expect(() => validateProtocolParams('GVT', {})).toThrow(BadRequestException);
    expect(() => validateProtocolParams('EMOM', { minutes: 10 })).not.toThrow();
    expect(() => validateProtocolParams('HIIT', { work: 30 })).toThrow(/work\/rest/);
    const prisma = makePrismaMock();
    const svc = new PlanEngineService(prisma as any);
    await expect(svc.createPlan({ title: 'bad', days: [{ order: 0, blocks: [{ order: 0, protocol: 'GVT' }] }] }))
      .rejects.toBeInstanceOf(BadRequestException);
    const plan = await seededPlan(svc);
    const pub = await svc.publishPlan(plan.id);
    expect(pub.status).toBe('PUBLISHED');
    expect(pub.version).toBe(2);
  });
});
