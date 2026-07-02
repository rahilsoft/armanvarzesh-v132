import { BadRequestException } from '@nestjs/common';
import { AssessmentsService } from '../assessments.service';

/** Assessments fold: scoring rule engine (map/range/boolean/weight), answer
 *  validation, clamping and recommendation thresholds. */
function makePrismaMock() {
  const assessments: any[] = [];
  const attempts: any[] = [];
  let seq = 1;
  return {
    _assessments: assessments, _attempts: attempts,
    assessment: {
      create: async ({ data }: any) => {
        const sections = (data.sections?.create ?? []).map((s: any) => ({
          id: seq++, title: s.title, order: s.order,
          questions: (s.questions?.create ?? []).map((q: any) => ({ id: seq++, ...q })),
        }));
        const a = { id: seq++, createdAt: new Date(), ...data, sections };
        assessments.push(a);
        return a;
      },
      findUnique: async ({ where }: any) => assessments.find((a) => a.id === where.id) ?? null,
      findMany: async () => assessments,
    },
    assessmentAttempt: {
      create: async ({ data }: any) => { const t = { id: seq++, createdAt: new Date(), ...data }; attempts.push(t); return t; },
      findUnique: async ({ where }: any) => attempts.find((t) => t.id === where.id) ?? null,
      findMany: async ({ where }: any) => attempts.filter((t) => t.userId === where.userId),
    },
  };
}

async function seeded() {
  const prisma = makePrismaMock();
  const svc = new AssessmentsService(prisma as any);
  const a = await svc.seed({
    code: 'fms-1', name: 'Movement screen', domain: 'mobility',
    sections: [{
      title: 'S1',
      questions: [
        { type: 'single', text: 'squat depth', scoring: { weight: 2, map: { good: 20, ok: 10, poor: 0 } } },
        { type: 'number', text: 'pushups', scoring: { range: { min: 0, max: 50, mult: 1 } } },
        { type: 'boolean', text: 'pain free', scoring: { weight: 10 } },
      ],
    }],
  });
  const qs = prisma._assessments[0].sections[0].questions;
  return { prisma, svc, a, qs };
}

describe('AssessmentsService (Assessments fold)', () => {
  it('scores map/range/boolean rules with weights and recommends by threshold', async () => {
    const { svc, a, qs } = await seeded();
    const res = await svc.submitAssessment({
      userId: 1, assessmentId: a.id,
      answers: [
        { questionId: qs[0].id, value: 'good' }, // 20*2 = 40
        { questionId: qs[1].id, value: 45 },     // 45
        { questionId: qs[2].id, value: true },   // 10
      ],
    });
    expect(res.score).toBe(95);
    expect(res.recommendation.plan).toBe('advanced');
    const mid = await svc.submitAssessment({ userId: 1, assessmentId: a.id, answers: [{ questionId: qs[1].id, value: 55 }] });
    expect(mid.score).toBe(50); // clipped to range max
    expect(mid.recommendation.plan).toBe('intermediate');
    const low = await svc.submitAssessment({ userId: 1, assessmentId: a.id, answers: [{ questionId: qs[2].id, value: false }] });
    expect(low.score).toBe(0);
    expect(low.recommendation.plan).toBe('beginner');
  });

  it('rejects unknown assessment and foreign question ids', async () => {
    const { svc, a } = await seeded();
    await expect(svc.submitAssessment({ userId: 1, assessmentId: 9999, answers: [] })).rejects.toBeInstanceOf(BadRequestException);
    await expect(svc.submitAssessment({ userId: 1, assessmentId: a.id, answers: [{ questionId: 424242, value: 1 }] }))
      .rejects.toThrow('BAD_QUESTION');
  });

  it('stores attempts retrievably per user and by id', async () => {
    const { svc, a, qs } = await seeded();
    const r = await svc.submitAssessment({ userId: 8, assessmentId: a.id, answers: [{ questionId: qs[2].id, value: true }] });
    const mine = await svc.myAttempts(8);
    expect(mine.items).toHaveLength(1);
    const byId = await svc.assessmentResult(r.attemptId);
    expect(byId.score).toBe(10);
    await expect(svc.assessmentResult(31337)).rejects.toBeInstanceOf(BadRequestException);
  });
});
