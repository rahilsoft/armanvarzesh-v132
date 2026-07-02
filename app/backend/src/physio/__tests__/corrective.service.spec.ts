import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CorrectiveService } from '../corrective.service';

/** Corrective fold: taxonomy guard on upload, moderation with audit row,
 *  public browse gate, idempotent daily checks against PhysioAssignment. */
function makePrismaMock() {
  const conditions: any[] = [];
  const videos: any[] = [];
  const moderation: any[] = [];
  const assignments: any[] = [{ id: 70, userId: 1 }];
  const checks: any[] = [];
  let seq = 1;
  return {
    _videos: videos, _moderation: moderation, _checks: checks,
    condition: {
      upsert: async ({ where, update, create }: any) => {
        let c = conditions.find((x) => x.code === where.code);
        if (c) Object.assign(c, update); else { c = { id: seq++, ...create }; conditions.push(c); }
        return c;
      },
      findMany: async ({ where }: any = {}) =>
        where?.code?.in ? conditions.filter((c) => where.code.in.includes(c.code)) : conditions,
    },
    correctiveVideo: {
      create: async ({ data }: any) => {
        const v = { id: seq++, status: 'PENDING', visibility: 'PRIVATE', ...data, conditions: (data.conditions?.create ?? []) };
        videos.push(v); return v;
      },
      findUnique: async ({ where }: any) => { const v = videos.find((x) => x.id === where.id); return v ? { ...v } : null; },
      update: async ({ where, data }: any) => { const v = videos.find((x) => x.id === where.id); Object.assign(v, data); return v; },
      findMany: async ({ where }: any) => videos.filter((v) =>
        v.status === where.status && v.visibility === where.visibility
        && (!where.conditions || v.conditions.some((c: any) => c.conditionCode === where.conditions.some.conditionCode))),
    },
    moderationLog: { create: async ({ data }: any) => { moderation.push({ id: seq++, ...data }); return data; } },
    physioAssignment: { findUnique: async ({ where }: any) => assignments.find((a) => a.id === where.id) ?? null },
    correctiveProgress: {
      upsert: async ({ where, update, create }: any) => {
        const k = where.assignmentId_dayIndex_itemKey;
        let c = checks.find((x) => x.assignmentId === k.assignmentId && x.dayIndex === k.dayIndex && x.itemKey === k.itemKey);
        if (c) Object.assign(c, update); else { c = { id: seq++, ...create }; checks.push(c); }
        return c;
      },
      findMany: async ({ where }: any) => checks.filter((c) => c.assignmentId === where.assignmentId),
    },
  };
}

describe('CorrectiveService (content dismemberment step 6)', () => {
  it('upload requires known conditions; review audits and gates browse', async () => {
    const prisma = makePrismaMock();
    const svc = new CorrectiveService(prisma as any);
    await svc.upsertCondition('knee-valgus', 'زانوی ضربدری');
    await expect(svc.uploadVideo(9, 'Fix', 'v://x', ['nope'])).rejects.toBeInstanceOf(BadRequestException);
    const v = await svc.uploadVideo(9, 'Fix valgus', 'v://1', ['knee-valgus']);
    expect(await svc.browse()).toHaveLength(0); // PENDING+PRIVATE hidden
    await svc.reviewVideo(v.id, 2, 'APPROVED' as any, 'ok', 'PUBLIC' as any);
    expect(prisma._moderation[0]).toMatchObject({ entity: 'CorrectiveVideo', action: 'APPROVE', actorId: 2 });
    expect(await svc.browse('knee-valgus')).toHaveLength(1);
    expect(await svc.browse('other')).toHaveLength(0);
    await expect(svc.reviewVideo(404, 2, 'APPROVED' as any)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('daily checks are idempotent per assignment+day+item and guarded', async () => {
    const prisma = makePrismaMock();
    const svc = new CorrectiveService(prisma as any);
    await expect(svc.logCheck(999, 0, 'stretch', 'done')).rejects.toBeInstanceOf(NotFoundException);
    await svc.logCheck(70, 0, 'stretch', 'done');
    await svc.logCheck(70, 0, 'stretch', 'partial'); // updates same row
    expect(prisma._checks).toHaveLength(1);
    expect(prisma._checks[0].value).toBe('partial');
    expect(await svc.checks(70)).toHaveLength(1);
  });
});
