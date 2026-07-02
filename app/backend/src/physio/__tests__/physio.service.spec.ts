import { BadRequestException } from '@nestjs/common';
import { PhysioService } from '../physio.service';

/**
 * Physio domain fold: verifies protocol assignment (archives previous, opens
 * today's session), owner-only session ops, VAS validation + rate limit and
 * ROM validation. Prisma is an in-memory mock; integration/E2E in CI.
 */
function makePrismaMock() {
  const protocols: any[] = [];
  const assignments: any[] = [];
  const sessions: any[] = [];
  const pains: any[] = [];
  const roms: any[] = [];
  let seq = 1;
  return {
    _protocols: protocols, _assignments: assignments, _sessions: sessions, _pains: pains, _roms: roms,
    physioProtocol: {
      findUnique: async ({ where, include }: any) => {
        const p = protocols.find((x) => x.id === where.id) ?? null;
        return p && include?.steps ? { ...p, steps: p.steps ?? [] } : p;
      },
      create: async ({ data }: any) => {
        const steps = (data.steps?.create ?? []).map((s: any) => ({ id: seq++, ...s }));
        const p = { id: seq++, ...data, steps };
        protocols.push(p);
        return p;
      },
    },
    physioAssignment: {
      updateMany: async ({ where, data }: any) => {
        let n = 0;
        for (const a of assignments) if (a.userId === where.userId && a.archivedAt === null) { Object.assign(a, data); n++; }
        return { count: n };
      },
      create: async ({ data }: any) => { const a = { id: seq++, archivedAt: null, ...data }; assignments.push(a); return a; },
      findFirst: async ({ where }: any) => assignments.find((a) => a.userId === where.userId && a.archivedAt === null) ?? null,
      findUnique: async ({ where }: any) => assignments.find((a) => a.id === where.id) ?? null,
      findMany: async ({ where }: any) => assignments.filter((a) => a.userId === where.userId),
    },
    physioSession: {
      create: async ({ data }: any) => { const s = { id: seq++, completed: false, completedAt: null, ...data }; sessions.push(s); return s; },
      findFirst: async ({ where }: any) => sessions.find((s) => s.assignmentId === where.assignmentId && s.date === where.date) ?? null,
      findUnique: async ({ where }: any) => sessions.find((s) => s.id === where.id) ?? null,
      update: async ({ where, data }: any) => { const s = sessions.find((x) => x.id === where.id); Object.assign(s, data); return s; },
    },
    painLog: {
      findFirst: async ({ where }: any) => [...pains].reverse().find((p) => p.sessionId === where.sessionId) ?? null,
      create: async ({ data }: any) => { const p = { id: seq++, createdAt: new Date(), ...data }; pains.push(p); return p; },
      findMany: async () => pains,
    },
    romMeasure: {
      create: async ({ data }: any) => { const r = { id: seq++, createdAt: new Date(), ...data }; roms.push(r); return r; },
      findMany: async ({ where }: any) => roms.filter((r) => r.userId === where.userId),
    },
  };
}

async function seeded() {
  const prisma = makePrismaMock();
  const svc = new PhysioService(prisma as any);
  await svc.seedProtocols([{ name: 'Knee rehab', area: 'knee', weeks: 6, steps: [{ week: 1, day: new Date().getDay() }] }]);
  return { prisma, svc, protocolId: prisma._protocols[0].id };
}

describe('PhysioService (Physio domain fold)', () => {
  it('assigns a protocol, archives the previous one, opens today session', async () => {
    const { prisma, svc, protocolId } = await seeded();
    const a1 = await svc.assignProtocol(7, protocolId);
    const a2 = await svc.assignProtocol(7, protocolId);
    expect(prisma._assignments.find((a: any) => a.id === a1.id).archivedAt).not.toBeNull();
    expect(prisma._assignments.find((a: any) => a.id === a2.id).archivedAt).toBeNull();
    expect(prisma._sessions.filter((s: any) => s.assignmentId === a2.id)).toHaveLength(1);
    await expect(svc.assignProtocol(7, 9999)).rejects.toThrow('PROTOCOL_NOT_FOUND');
  });

  it('myPlan returns the active assignment with today steps', async () => {
    const { svc, protocolId } = await seeded();
    await svc.assignProtocol(3, protocolId);
    const plan = await svc.myPlan(3);
    expect(plan).not.toBeNull();
    expect(plan!.today.session).not.toBeNull();
    expect(plan!.today.steps).toHaveLength(1); // seeded step is for today
    expect(await svc.myPlan(99)).toBeNull();
  });

  it('completeSession is owner-only and idempotent', async () => {
    const { prisma, svc, protocolId } = await seeded();
    const a = await svc.assignProtocol(5, protocolId);
    const session = prisma._sessions.find((s: any) => s.assignmentId === a.id);
    await expect(svc.completeSession(session.id, 6)).rejects.toThrow('FORBIDDEN');
    const done = await svc.completeSession(session.id, 5);
    expect(done.completed).toBe(true);
    expect((await svc.completeSession(session.id, 5)).completedAt).toEqual(done.completedAt);
  });

  it('logPain validates VAS range and enforces the 2h rate limit', async () => {
    const { prisma, svc, protocolId } = await seeded();
    const a = await svc.assignProtocol(4, protocolId);
    const session = prisma._sessions.find((s: any) => s.assignmentId === a.id);
    await expect(svc.logPain(session.id, 11, undefined, 4)).rejects.toThrow('VAS_RANGE');
    await svc.logPain(session.id, 6, 'sore', 4);
    await expect(svc.logPain(session.id, 5, undefined, 4)).rejects.toThrow('VAS_TOO_FREQUENT');
    prisma._pains[0].createdAt = new Date(Date.now() - 3 * 60 * 60 * 1000); // age the last log
    await expect(svc.logPain(session.id, 5, undefined, 4)).resolves.toMatchObject({ score: 5 });
  });

  it('recordRom validates joint and angle', async () => {
    const { svc } = await seeded();
    await expect(svc.recordRom(1, '', 'left', 90)).rejects.toBeInstanceOf(BadRequestException);
    await expect(svc.recordRom(1, 'knee', 'left', 999)).rejects.toThrow('ANGLE_RANGE');
    await expect(svc.recordRom(1, 'knee', 'bilateral', 120)).resolves.toMatchObject({ joint: 'knee', angle: 120 });
  });
});
