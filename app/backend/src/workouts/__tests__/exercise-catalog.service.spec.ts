import { NotFoundException } from '@nestjs/common';
import { ExerciseCatalogService } from '../exercise-catalog.service';

/** Exercise catalog fold: taxonomy connect, moderation gate on search,
 *  anatomy config single-active invariant. */
function makePrismaMock() {
  const videos: any[] = [];
  const muscles: any[] = [];
  const sports: any[] = [];
  const equipment: any[] = [];
  const anatomy: any[] = [];
  let seq = 1;
  return {
    _videos: videos, _muscles: muscles, _anatomy: anatomy,
    exerciseVideo: {
      create: async ({ data }: any) => {
        const v = {
          id: seq++, status: 'PENDING', viewCount: 0, likeCount: 0, createdAt: new Date(),
          ...data,
          primaryMuscles: (data.primaryMuscles?.connect ?? []).map((c: any) => muscles.find((m) => m.code === c.code)),
          secondaryMuscles: (data.secondaryMuscles?.connect ?? []).map((c: any) => muscles.find((m) => m.code === c.code)),
          equipment: (data.equipment?.connect ?? []).map((c: any) => equipment.find((e) => e.id === c.id)),
          sports: (data.sports?.connect ?? []).map((c: any) => sports.find((s) => s.id === c.id)),
        };
        videos.push(v); return v;
      },
      findUnique: async ({ where }: any) => videos.find((v) => v.id === where.id) ?? null,
      update: async ({ where, data }: any) => {
        const v = videos.find((x) => x.id === where.id);
        if (data.viewCount?.increment) v.viewCount += data.viewCount.increment;
        else Object.assign(v, data);
        return v;
      },
      findMany: async ({ where, take }: any) => videos.filter((v) =>
        (!where.status || v.status === where.status)
        && (!where.title || v.title.toLowerCase().includes(where.title.contains.toLowerCase()))
        && (!where.level || v.level === where.level)
        && (!where.kind || v.kind === where.kind)
        && (!where.primaryMuscles || v.primaryMuscles.some((m: any) => m?.code === where.primaryMuscles.some.code)),
      ).slice(0, take),
    },
    muscleRef: {
      upsert: async ({ where, update, create }: any) => {
        let m = muscles.find((x) => x.code === where.code);
        if (m) Object.assign(m, update); else { m = { id: seq++, ...create }; muscles.push(m); }
        return m;
      },
      findMany: async () => muscles,
    },
    sport: { create: async ({ data }: any) => { const s = { id: seq++, ...data }; sports.push(s); return s; } },
    equipmentCatalog: { create: async ({ data }: any) => { const e = { id: seq++, ...data }; equipment.push(e); return e; } },
    anatomyConfig: {
      updateMany: async ({ where, data }: any) => {
        for (const a of anatomy) if (a.gender === where.gender && a.active) Object.assign(a, data);
        return { count: 1 };
      },
      create: async ({ data }: any) => { const a = { id: seq++, ...data }; anatomy.push(a); return a; },
      findFirst: async ({ where }: any) => anatomy.find((a) => a.gender === where.gender && a.active) ?? null,
    },
  };
}

describe('ExerciseCatalogService (content dismemberment step 1)', () => {
  it('creates a video with taxonomy connections and moderates visibility', async () => {
    const prisma = makePrismaMock();
    const svc = new ExerciseCatalogService(prisma as any);
    await svc.upsertMuscle('pec', 'Pectoralis');
    const v = await svc.createVideo({ title: 'Bench Press', videoUrl: 'v://1', level: 'BEGINNER', kind: 'STRENGTH', primaryMuscleCodes: ['pec'] });
    expect((v as any).primaryMuscles[0].code).toBe('pec');
    expect(await svc.search({ q: 'bench' })).toHaveLength(0); // PENDING hidden
    await svc.setStatus(v.id, 'APPROVED' as any);
    expect(await svc.search({ q: 'bench' })).toHaveLength(1);
    expect(await svc.search({ q: 'bench', muscleCode: 'pec' })).toHaveLength(1);
    expect(await svc.search({ q: 'bench', muscleCode: 'lat' })).toHaveLength(0);
    await expect(svc.setStatus(999, 'APPROVED' as any)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('view counter increments; anatomy config keeps a single active per gender', async () => {
    const prisma = makePrismaMock();
    const svc = new ExerciseCatalogService(prisma as any);
    const v = await svc.createVideo({ title: 'Squat', videoUrl: 'v://2' });
    await svc.incrementView(v.id);
    await svc.incrementView(v.id);
    expect(prisma._videos[0].viewCount).toBe(2);
    await svc.setAnatomyConfig('male', 'm://1', { pec: 'mesh1' });
    await svc.setAnatomyConfig('male', 'm://2', { pec: 'mesh2' });
    expect(prisma._anatomy.filter((a: any) => a.active)).toHaveLength(1);
    expect((await svc.activeAnatomyConfig('male'))?.modelUrl).toBe('m://2');
  });
});
