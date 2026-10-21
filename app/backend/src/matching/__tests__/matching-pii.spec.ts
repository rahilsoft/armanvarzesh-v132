import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { MatchingController } from '../matching.controller';
import { MatchingResolver } from '../matching.resolver';
import { MatchingService } from '../matching.service';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { GqlJwtAuthGuard } from '../gql-jwt-auth.guard';

const SECRET = 'test-secret-test-secret-test-secret-0123';
const NOW = new Date('2026-01-01T00:00:00Z');

const c = (id: number, verified: boolean) => ({
  id, email: `c${id}@secret.ir`, name: `c${id}`, expertise: 'trainer',
  speciality: null, certifications: null, bio: null, verified, createdAt: NOW,
});

function build() {
  const all = [c(1, true), c(2, false), c(3, true)];
  const coachesService: any = {
    findAll: async (v = false) => (v ? all.filter((x) => x.verified) : all),
    findOne: async (id: number) => all.find((x) => x.id === id) ?? null,
  };
  const reviewsService: any = { findByExpert: () => [] };
  const svc = new MatchingService(coachesService, reviewsService);
  return { svc, ctl: new MatchingController(svc, coachesService, reviewsService), res: new MatchingResolver(svc) };
}

const httpCtx = (authorization?: string) =>
  ({ switchToHttp: () => ({ getRequest: () => ({ headers: authorization ? { authorization } : {} }) }) }) as unknown as ExecutionContext;

describe('matching PII', () => {
  beforeEach(() => { process.env.JWT_SECRET = SECRET; });

  it('REST guard: 401 without JWT, ok with valid JWT', () => {
    const g = new JwtAuthGuard();
    expect(() => g.canActivate(httpCtx())).toThrow(UnauthorizedException);
    expect(() => g.canActivate(httpCtx('Bearer bad'))).toThrow(UnauthorizedException);
    const t = jwt.sign({ sub: '1' }, SECRET, { algorithm: 'HS256' });
    expect(g.canActivate(httpCtx(`Bearer ${t}`))).toBe(true);
  });

  it('GraphQL guard: 401 without JWT', () => {
    const g = new GqlJwtAuthGuard();
    const gql = (headers: any) => {
      const args = [{}, {}, { req: { headers } }, {}];
      return { getType: () => 'graphql', getClass: () => null, getHandler: () => null, getArgs: () => args, getArgByIndex: (i: number) => args[i] } as unknown as ExecutionContext;
    };
    expect(() => g.canActivate(gql({}))).toThrow(UnauthorizedException);
    const t = jwt.sign({ sub: '1' }, SECRET, { algorithm: 'HS256' });
    expect(g.canActivate(gql({ authorization: `Bearer ${t}` }))).toBe(true);
  });

  it('recommend returns only verified coaches, no email', async () => {
    const { ctl, res } = build();
    for (const out of [await ctl.recommend(undefined, '10'), await res.recommendedCoaches(undefined, 10)]) {
      expect(out.map((x) => x.id).sort()).toEqual([1, 3]);
      expect(JSON.stringify(out)).not.toContain('secret.ir');
      out.forEach((x) => expect(x).not.toHaveProperty('email'));
    }
  });

  it('coach/:id hides email and unverified coaches', async () => {
    const { ctl } = build();
    const ok = await ctl.getCoach(1);
    expect(ok.coach).not.toHaveProperty('email');
    expect(JSON.stringify(ok)).not.toContain('secret.ir');
    expect((await ctl.getCoach(2)).coach).toBeNull();
    expect((await ctl.getCoach(99)).coach).toBeNull();
  });
});
