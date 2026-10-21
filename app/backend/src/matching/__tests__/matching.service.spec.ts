import { MatchingService, MATCHING_WEIGHTS, MAX_GOALS, MAX_GOAL_LENGTH, MAX_LIMIT, sanitizeGoals } from '../matching.service';

const NOW = Date.UTC(2026, 9, 21);
const DAY = 86400000;

function coach(id: number, o: Partial<any> = {}) {
  return {
    id,
    email: `c${id}@x.ir`,
    name: `c${id}`,
    expertise: 'trainer',
    speciality: null,
    certifications: null,
    bio: null,
    verified: true,
    createdAt: new Date(NOW - 100 * DAY),
    ...o,
  };
}

function make(coaches: any[], reviews: Record<number, number[]> = {}) {
  const coachesService: any = { findAll: async (verifiedOnly = false) => (verifiedOnly ? coaches.filter((c) => c.verified) : coaches) };
  const reviewsService: any = {
    findByExpert: (id: number) => (reviews[id] ?? []).map((rating) => ({ expertId: id, rating })),
  };
  return new MatchingService(coachesService, reviewsService);
}

describe('MatchingService', () => {
  it('weights sum to 1', () => {
    expect(Object.values(MATCHING_WEIGHTS).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 9);
  });

  it('is deterministic and never uses Math.random', async () => {
    const spy = jest.spyOn(Math, 'random');
    const svc = make([coach(3), coach(1), coach(2)]);
    const a = (await svc.recommend(undefined, 3, [], NOW)).map((c) => c.id);
    const b = (await svc.recommend(undefined, 3, [], NOW)).map((c) => c.id);
    expect(a).toEqual(b);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('breaks ties by ascending coach id', async () => {
    const svc = make([coach(9), coach(4), coach(7)]);
    const ids = (await svc.recommend(undefined, 3, [], NOW)).map((c) => c.id);
    expect(ids).toEqual([4, 7, 9]);
  });

  it('ranks goal match above a coach with no match', async () => {
    const svc = make([
      coach(1, { verified: true }),
      coach(2, { speciality: 'weight loss and strength', bio: 'helps with fat loss' }),
    ]);
    const ids = (await svc.recommend(undefined, 2, ['weight', 'loss'], NOW)).map((c) => c.id);
    expect(ids[0]).toBe(2);
  });

  it('rewards rating and shrinks tiny samples', async () => {
    const svc = make([coach(1), coach(2), coach(3)], {
      1: [5],
      2: [5, 5, 5, 5, 5, 5, 5, 5],
      3: [1, 1, 1, 1],
    });
    const ids = (await svc.recommend(undefined, 3, [], NOW)).map((c) => c.id);
    expect(ids).toEqual([2, 1, 3]);
  });

  it('rewards experience, saturating at two years', async () => {
    const svc = make([
      coach(1, { createdAt: new Date(NOW - 10 * DAY) }),
      coach(2, { createdAt: new Date(NOW - 800 * DAY) }),
      coach(3, { createdAt: new Date(NOW - 3000 * DAY) }),
    ]);
    const ids = (await svc.recommend(undefined, 3, [], NOW)).map((c) => c.id);
    expect(ids).toEqual([2, 3, 1]);
  });

  it('applies exact component weights', () => {
    const svc = make([]);
    const c = coach(1, {
      verified: true,
      certifications: 'NASM',
      bio: 'strength',
      createdAt: new Date(NOW - 2000 * DAY),
    });
    const score = svc.scoreCoach(c as any, ['strength'], NOW);
    const expected =
      MATCHING_WEIGHTS.goalMatch +
      0.7 * MATCHING_WEIGHTS.rating +
      MATCHING_WEIGHTS.experience +
      MATCHING_WEIGHTS.verified +
      MATCHING_WEIGHTS.completeness;
    expect(score).toBeCloseTo(expected, 8);
  });

  it('filters by expertise and honours limit', async () => {
    const svc = make([coach(1), coach(2, { expertise: 'nutrition' }), coach(3)]);
    expect((await svc.recommend('trainer', 1, [], NOW)).map((c) => c.id)).toEqual([1]);
    expect((await svc.recommend('nutrition', 5, [], NOW)).map((c) => c.id)).toEqual([2]);
  });

  it('package mode returns one per domain', async () => {
    const svc = make([
      coach(1),
      coach(2, { expertise: 'nutrition' }),
      coach(3, { expertise: 'physio' }),
      coach(4),
    ]);
    const ids = (await svc.recommend('package', 3, [], NOW)).map((c) => c.id);
    expect(ids).toEqual([1, 2, 3]);
  });

  it('caps untrusted goals and limit', async () => {
    const many = Array.from({ length: 500 }, (_, i) => `g${i}`);
    expect(sanitizeGoals(many)).toHaveLength(MAX_GOALS);
    expect(sanitizeGoals(['x'.repeat(10000)])[0]).toHaveLength(MAX_GOAL_LENGTH);
    expect(sanitizeGoals([1, null, ' ', 'ok'] as any)).toEqual(['ok']);
    expect(sanitizeGoals('weight' as any)).toEqual([]);
    const svc = make(Array.from({ length: 50 }, (_, i) => coach(i + 1)));
    expect(await svc.recommend(undefined, 10000, many, NOW)).toHaveLength(MAX_LIMIT);
  });
});
