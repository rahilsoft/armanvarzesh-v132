import { NotFoundException } from '@nestjs/common';
import { CmsTilesService } from '../tiles.service';

/** CMS group fold: tile version/audit trail, publish workflow, intake form
 *  lifecycle, feature flags, lead conversion. */
function makePrismaMock() {
  const tiles: any[] = []; const versions: any[] = []; const audits: any[] = [];
  const forms: any[] = []; const responses: any[] = []; const flags: any[] = [];
  const leads: any[] = []; const conversions: any[] = []; const surveys: any[] = [];
  let seq = 1;
  return {
    _tiles: tiles, _versions: versions, _audits: audits, _forms: forms,
    _responses: responses, _leads: leads, _conversions: conversions, _surveys: surveys,
    tile: {
      create: async ({ data }: any) => { const t = { id: seq++, state: 'DRAFT', version: 1, order: 0, ...data }; tiles.push(t); return t; },
      update: async ({ where, data }: any) => {
        const t = tiles.find((x) => x.id === where.id);
        if (data.version?.increment) { t.version += data.version.increment; delete data.version; }
        Object.assign(t, data); return t;
      },
      // shallow copy: real Prisma returns row snapshots, not live references
      findUnique: async ({ where }: any) => { const t = tiles.find((x) => x.id === where.id); return t ? { ...t } : null; },
      findMany: async ({ where }: any) => tiles.filter((t) => t.page === where.page && t.state === where.state).sort((a, b) => a.order - b.order),
    },
    tileVersion: {
      create: async ({ data }: any) => { versions.push({ id: seq++, ...data }); return data; },
      findMany: async ({ where }: any) => versions.filter((v) => v.tileId === where.tileId).sort((a, b) => b.version - a.version),
    },
    publishAudit: { create: async ({ data }: any) => { audits.push({ id: seq++, ...data }); return data; } },
    intakeForm: {
      create: async ({ data }: any) => { const f = { id: seq++, active: false, version: 1, questions: data.questions?.create ?? [], slug: data.slug, title: data.title }; forms.push(f); return f; },
      findUnique: async ({ where }: any) => forms.find((f) => f.slug === where.slug) ?? null,
      update: async ({ where, data }: any) => {
        const f = forms.find((x) => x.slug === where.slug);
        if (data.version?.increment) { f.version += data.version.increment; delete data.version; }
        Object.assign(f, data); return f;
      },
    },
    intakeResponse: { create: async ({ data }: any) => { const r = { id: seq++, ...data }; responses.push(r); return r; } },
    featureFlag: {
      upsert: async ({ where, update, create }: any) => {
        let f = flags.find((x) => x.key === where.key);
        if (f) Object.assign(f, update); else { f = { id: seq++, ...create }; flags.push(f); }
        return f;
      },
      findUnique: async ({ where }: any) => flags.find((f) => f.key === where.key) ?? null,
    },
    lead: {
      create: async ({ data }: any) => { const l = { id: seq++, status: 'OPEN', ...data }; leads.push(l); return l; },
      updateMany: async ({ where, data }: any) => {
        let n = 0;
        for (const l of leads) if (l.userId === where.userId && l.specialistId === where.specialistId && l.status === where.status) { Object.assign(l, data); n++; }
        return { count: n };
      },
    },
    conversionEvent: { create: async ({ data }: any) => { conversions.push({ id: seq++, ...data }); return data; } },
    surveyResponse: { create: async ({ data }: any) => { surveys.push({ id: seq++, ...data }); return data; } },
  };
}

describe('CmsTilesService (content dismemberment step 5)', () => {
  it('every tile mutation snapshots a version and writes an audit row; publish flips state', async () => {
    const prisma = makePrismaMock();
    const svc = new CmsTilesService(prisma as any);
    const t = await svc.upsertTile({ page: 'home', type: 'hero', data: { title: 'hi' }, actorId: 1 });
    await svc.upsertTile({ id: t.id, page: 'home', type: 'hero', data: { title: 'v2' }, actorId: 1 });
    expect(prisma._versions).toHaveLength(2);
    expect(prisma._audits.map((a: any) => a.action)).toEqual(['UPSERT', 'UPSERT']);
    expect(prisma._tiles[0].version).toBe(2);
    expect(await svc.pageTiles('home')).toHaveLength(0); // still DRAFT
    await svc.publishTile(t.id, 9);
    expect(prisma._audits[2]).toMatchObject({ action: 'PUBLISH', fromState: 'DRAFT', toState: 'PUBLISHED' });
    expect(await svc.pageTiles('home')).toHaveLength(1);
    await expect(svc.publishTile(404)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('intake: submit requires an active form and records the form version', async () => {
    const prisma = makePrismaMock();
    const svc = new CmsTilesService(prisma as any);
    await svc.createIntakeForm('onboarding', 'Onboarding', [{ key: 'goal', label: 'Goal?', type: 'text' }]);
    await expect(svc.submitIntake(1, 'onboarding', { goal: 'cut' })).rejects.toThrow('FORM_NOT_ACTIVE');
    await svc.activateIntakeForm('onboarding');
    const r = await svc.submitIntake(1, 'onboarding', { goal: 'cut' });
    expect(r.formVersion).toBe(2); // activation bumped version
  });

  it('flags upsert + read; FREE_TO_PREMIUM conversion closes the open lead', async () => {
    const prisma = makePrismaMock();
    const svc = new CmsTilesService(prisma as any);
    expect(await svc.isEnabled('newUi')).toBe(false);
    await svc.setFlag('newUi', true, 1);
    expect(await svc.isEnabled('newUi')).toBe(true);
    await svc.createLead(5, 10, 'COACH' as any);
    await svc.recordConversion(5, 10, 'COACH' as any, 'FREE_TO_PREMIUM');
    expect(prisma._leads[0].status).toBe('CONVERTED');
    expect(prisma._conversions).toHaveLength(1);
    await svc.submitSurveyResponse('BIWEEKLY', 5, 10, 4, 'خوب');
    expect(prisma._surveys[0].rating).toBe(4);
  });
});
