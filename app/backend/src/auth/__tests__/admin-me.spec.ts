import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AdminController } from '../admin.controller';
import { AdminGuard } from '../admin.guard';

const ADMIN_SECRET = 'admin-secret-admin-secret-admin-secret-1';
const USER_SECRET = 'user-secret-user-secret-user-secret-123';

const ctx = (authorization?: string) => {
  const req: any = { headers: authorization ? { authorization } : {} };
  return { req, ctx: { switchToHttp: () => ({ getRequest: () => req }) } as unknown as ExecutionContext };
};

describe('GET /admin/me', () => {
  const OLD = { ...process.env };
  beforeEach(() => {
    process.env.ADMIN_JWT_SECRET = ADMIN_SECRET;
    process.env.JWT_SECRET = USER_SECRET;
    delete process.env.ADMIN_API_TOKEN;
  });
  afterAll(() => { process.env = OLD; });

  it('401 without token', () => {
    expect(() => new AdminGuard().canActivate(ctx().ctx)).toThrow(UnauthorizedException);
  });

  it('rejects a normal user JWT', () => {
    const t = jwt.sign({ sub: '5', role: 'admin' }, USER_SECRET, { algorithm: 'HS256' });
    expect(() => new AdminGuard().canActivate(ctx(`Bearer ${t}`).ctx)).toThrow(UnauthorizedException);
  });

  it('returns id and role from verified admin token', () => {
    const t = jwt.sign({ sub: 'boss@x.ir', role: 'owner' }, ADMIN_SECRET, { algorithm: 'HS256' });
    const { req, ctx: c } = ctx(`Bearer ${t}`);
    expect(new AdminGuard().canActivate(c)).toBe(true);
    expect(new AdminController().me(req)).toEqual({ id: 'boss@x.ir', role: 'owner', email: 'boss@x.ir' });
  });

  it('rejects unknown role and static API token (no identity)', () => {
    const t = jwt.sign({ sub: 'u', role: 'superuser' }, ADMIN_SECRET, { algorithm: 'HS256' });
    const a = ctx(`Bearer ${t}`);
    new AdminGuard().canActivate(a.ctx);
    expect(() => new AdminController().me(a.req)).toThrow(UnauthorizedException);
    process.env.ADMIN_API_TOKEN = 'static-token';
    const b = ctx('Bearer static-token');
    expect(new AdminGuard().canActivate(b.ctx)).toBe(true);
    expect(() => new AdminController().me(b.req)).toThrow(UnauthorizedException);
  });
});
