import { SpecialistScoringService, SpecialistMetricSources, computeMetrics, weightedTotal, DEFAULT_WEIGHTS, RawActivity } from '../specialist-scoring.service';

/** Specialist scoring fold: metric normalisation formulas, newcomer baseline,
 *  weighted total, upsert+history persistence, per-role weights override. */
const ZERO: RawActivity = {
  messages90d: 0, voiceMessages90d: 0, biweeklyRatings: [], endtermRatings: [],
  renewals90d: 0, uniqueClients90d: 0, plans90d: 0, plansWithGoal90d: 0,
  freeToPremium90d: 0, leads90d: 0, approvedVideos: 0, messages24h: 0,
  messages7d: 0, hasAnyClients: false,
};

function makePrismaMock() {
  const scores: any[] = [];
  const history: any[] = [];
  const weights: any[] = [];
  let seq = 1;
  return {
    _scores: scores, _history: history,
    scoringWeights: {
      findUnique: async ({ where }: any) => weights.find((w) => w.role === where.role) ?? null,
      upsert: async ({ where, update, create }: any) => {
        let w = weights.find((x) => x.role === where.role);
        if (w) Object.assign(w, update); else { w = { id: seq++, ...create }; weights.push(w); }
        return w;
      },
    },
    specialistScore: {
      upsert: async ({ where, update, create }: any) => {
        const k = where.specialistId_role;
        let r = scores.find((x) => x.specialistId === k.specialistId && x.role === k.role);
        if (r) Object.assign(r, update); else { r = { id: seq++, ...create }; scores.push(r); }
        return r;
      },
      findMany: async ({ where, orderBy, take, select }: any) => {
        let rows = where?.role ? scores.filter((s) => s.role === where.role) : [...scores];
        if (orderBy?.totalScore === 'desc') rows.sort((a, b) => b.totalScore - a.totalScore);
        if (take) rows = rows.slice(0, take);
        return select ? rows.map((r) => ({ specialistId: r.specialistId, role: r.role })) : rows;
      },
    },
    specialistScoreHistory: { create: async ({ data }: any) => { history.push({ id: seq++, ...data }); return data; } },
    plan: { findMany: async () => [] },
  };
}

class StubSources extends SpecialistMetricSources {
  constructor(private raw: RawActivity) { super(); }
  async collect() { return this.raw; }
}

describe('Specialist scoring (content dismemberment step 4)', () => {
  it('normalises metrics exactly as the original formulas', () => {
    const m = computeMetrics({
      ...ZERO,
      messages90d: 100, voiceMessages90d: 25,
      biweeklyRatings: [5, 4], endtermRatings: [3],
      renewals90d: 2, uniqueClients90d: 4,
      plans90d: 10, plansWithGoal90d: 7,
      freeToPremium90d: 1, leads90d: 4,
      approvedVideos: 50, messages24h: 10, messages7d: 60, hasAnyClients: true,
    });
    expect(m.followup).toBe(0.5);        // 100/200
    expect(m.multimodal).toBe(0.25);     // 25/100
    expect(m.biweekly).toBe(0.9);        // (5+4)/(2*5)
    expect(m.endterm).toBe(0.6);         // 3/5
    expect(m.renewal).toBe(0.5);         // 2/4
    expect(m.goalFocus).toBe(0.7);       // 7/10
    expect(m.freeToPremium).toBe(0.25);  // 1/4
    expect(m.contentQuality).toBe(0.5);  // 50/100
    expect(m.responsiveness).toBe(0.5);  // (10/60)*3
    expect(m.baselineBoost).toBe(0);
  });

  it('gives newcomers the baseline boost and clamps ratios at 1', () => {
    const m = computeMetrics({ ...ZERO, messages90d: 999, hasAnyClients: false });
    expect(m.followup).toBe(1);
    expect(m.baselineBoost).toBe(0.25);
    expect(weightedTotal({ ...DEFAULT_WEIGHTS, baselineBoost: 1 }, m)).toBeCloseTo(DEFAULT_WEIGHTS.followup * 1 + 0.25);
  });

  it('computeFor persists an upsert + a history row; topByRole orders desc', async () => {
    const prisma = makePrismaMock();
    const svc = new SpecialistScoringService(prisma as any, new StubSources({ ...ZERO, messages90d: 200, hasAnyClients: true }));
    await svc.computeFor(1, 'COACH' as any);
    await svc.computeFor(1, 'COACH' as any); // upsert, not duplicate
    expect(prisma._scores).toHaveLength(1);
    expect(prisma._history).toHaveLength(2); // every compute archives
    const svc2 = new SpecialistScoringService(prisma as any, new StubSources(ZERO));
    await svc2.computeFor(2, 'COACH' as any);
    const top = await svc.topByRole('COACH' as any, 2);
    expect(top[0].specialistId).toBe(1); // higher followup score first
    expect(await svc.recomputeAll()).toBe(2);
  });

  it('per-role weights override the defaults', async () => {
    const prisma = makePrismaMock();
    const svc = new SpecialistScoringService(prisma as any, new StubSources({ ...ZERO, messages90d: 200, hasAnyClients: true }));
    await svc.setWeightsFor('COACH' as any, { ...DEFAULT_WEIGHTS, followup: 1 });
    const r = await svc.computeFor(3, 'COACH' as any);
    expect(r.total).toBeCloseTo(1); // followup=1 × weight 1
  });
});
