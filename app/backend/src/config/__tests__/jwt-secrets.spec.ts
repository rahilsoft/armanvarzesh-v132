import * as jwt from 'jsonwebtoken';
import { requireJwtSecret, optionalJwtSecret } from '../jwt-secrets';
import { envValidationSchema } from '../env.validation';
import { jwtSecret } from '../../auth/user-auth.module';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { AdminGuard } from '../../auth/admin.guard';
import { AuthService } from '../../auth/auth.service';

const STRONG = 'x'.repeat(40);
const saved = { ...process.env };
afterEach(() => { process.env = { ...saved }; });

describe('production JWT secret strength', () => {
  beforeEach(() => { process.env.NODE_ENV = 'production'; });

  it('rejects a short secret', () => {
    process.env.JWT_SECRET = 'x'.repeat(31);
    expect(() => requireJwtSecret('JWT_SECRET')).toThrow(/at least 32/);
    expect(() => jwtSecret()).toThrow(/at least 32/);
  });

  it('rejects a missing secret', () => {
    delete process.env.JWT_SECRET;
    expect(() => requireJwtSecret('JWT_SECRET')).toThrow(/Missing required env/);
    expect(() => jwtSecret()).toThrow();
    delete process.env.ADMIN_JWT_SECRET;
    expect(() => optionalJwtSecret('ADMIN_JWT_SECRET')).toThrow();
  });

  it('accepts a 32+ char secret', () => {
    process.env.JWT_SECRET = STRONG;
    expect(requireJwtSecret('JWT_SECRET')).toBe(STRONG);
  });

  it('rejects short REFRESH_JWT_SECRET even when JWT_SECRET is strong', () => {
    process.env.JWT_SECRET = STRONG;
    process.env.REFRESH_JWT_SECRET = 'short';
    expect(() => requireJwtSecret('REFRESH_JWT_SECRET', 'JWT_SECRET')).toThrow(/REFRESH_JWT_SECRET/);
  });
});

describe('env validation schema', () => {
  const base = { NODE_ENV: 'test', DATABASE_URL: 'postgres://u:p@localhost:5432/db' };
  it('rejects JWT_SECRET shorter than 32', () => {
    expect(envValidationSchema.validate({ ...base, JWT_SECRET: 'a'.repeat(31) }).error).toBeDefined();
  });
  it('rejects missing JWT_SECRET', () => {
    expect(envValidationSchema.validate(base).error).toBeDefined();
  });
  it('accepts 32 chars', () => {
    expect(envValidationSchema.validate({ ...base, JWT_SECRET: 'a'.repeat(32) }).error).toBeUndefined();
  });
});

describe('algorithm pinning (HS256)', () => {
  const ctx = (token: string) => ({
    switchToHttp: () => ({ getRequest: () => ({ headers: { authorization: `Bearer ${token}` } }) }),
    getHandler: () => null, getClass: () => null,
  }) as any;

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = STRONG;
    process.env.ADMIN_JWT_SECRET = STRONG;
    delete process.env.REFRESH_JWT_SECRET;
    delete process.env.ADMIN_API_TOKEN;
  });

  it('JwtAuthGuard accepts HS256 and rejects HS512 and alg none', () => {
    const guard = new JwtAuthGuard();
    expect(guard.canActivate(ctx(jwt.sign({ sub: '1' }, STRONG, { algorithm: 'HS256' })))).toBe(true);
    expect(() => guard.canActivate(ctx(jwt.sign({ sub: '1' }, STRONG, { algorithm: 'HS512' })))).toThrow();
    const none = jwt.sign({ sub: '1' }, '', { algorithm: 'none' } as any);
    expect(() => guard.canActivate(ctx(none))).toThrow();
  });

  it('AdminGuard rejects HS512 and alg none', () => {
    const guard = new AdminGuard();
    expect(guard.canActivate(ctx(jwt.sign({ sub: 'a' }, STRONG, { algorithm: 'HS256' })))).toBe(true);
    expect(() => guard.canActivate(ctx(jwt.sign({ sub: 'a' }, STRONG, { algorithm: 'HS512' })))).toThrow();
    expect(() => guard.canActivate(ctx(jwt.sign({ sub: 'a' }, '', { algorithm: 'none' } as any)))).toThrow();
  });

  it('AuthService.refresh rejects HS512 refresh tokens', async () => {
    const svc = new AuthService();
    const bad = jwt.sign({ sub: 'u', role: 'owner' }, STRONG, { algorithm: 'HS512' });
    await expect(svc.refresh(bad)).rejects.toThrow();
    const good = jwt.sign({ sub: 'u', role: 'owner' }, STRONG, { algorithm: 'HS256' });
    await expect(svc.refresh(good)).resolves.toHaveProperty('accessToken');
  });
});
