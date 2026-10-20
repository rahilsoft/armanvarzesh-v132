import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../../src/auth/user-auth.module';
import { JwksController } from '../../src/auth/jwks.controller';
import { CoursesService } from '../../src/courses/courses.service';
import { AuthUseCase } from '../../src/lib/domain/auth.usecase';
import { envValidationSchema } from '../../src/config/env.validation';

const saved = { ...process.env };
afterEach(() => {
  process.env = { ...saved };
});

describe('dev fallback only in development/test', () => {
  it.each(['staging', 'prod', undefined, 'production'])('jwtSecret requires secret when NODE_ENV=%s', (env) => {
    if (env === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = env;
    delete process.env.JWT_SECRET;
    expect(() => jwtSecret()).toThrow(/Missing required env/);
  });
  it.each(['development', 'test'])('jwtSecret falls back when NODE_ENV=%s', (env) => {
    process.env.NODE_ENV = env;
    delete process.env.JWT_SECRET;
    expect(jwtSecret()).toContain('dev-only');
  });
  it('jwks requires JWT_KID on staging', async () => {
    process.env.NODE_ENV = 'staging';
    delete process.env.JWT_KID;
    await expect(new JwksController({} as any).getJwks()).rejects.toThrow(/JWT_KID/);
  });
  it('jwks allows dev kid in test', async () => {
    process.env.NODE_ENV = 'test';
    delete process.env.JWT_KID;
    delete process.env.JWKS_PRIVATE_PEM;
    await expect(new JwksController({} as any).getJwks()).resolves.toEqual({ keys: [] });
  });
});

describe('algorithm pinning', () => {
  it('certificate verify rejects HS512 token', async () => {
    process.env.NODE_ENV = 'test';
    process.env.CERT_SECRET = 'x'.repeat(32);
    const tok = jwt.sign({ code: 'C1' }, process.env.CERT_SECRET, { algorithm: 'HS512' });
    const findUnique = jest.fn().mockResolvedValue({ revoked: false });
    const svc = new CoursesService({ certificate: { findUnique } } as any);
    await expect(svc.verifyCertificate(tok)).resolves.toEqual({ valid: false });
    expect(findUnique).not.toHaveBeenCalled();
    const ok = jwt.sign({ code: 'C1' }, process.env.CERT_SECRET, { algorithm: 'HS256' });
    await expect(svc.verifyCertificate(ok)).resolves.toMatchObject({ valid: true });
  });
  it('refresh rejects HS512 refresh token', async () => {
    const secret = 's'.repeat(32);
    const tok = jwt.sign({ sub: 1, typ: 'refresh' }, secret, { algorithm: 'HS512' });
    const findById = jest.fn().mockResolvedValue({ id: 1, username: 'u', roles: [] });
    const uc = new AuthUseCase(new JwtService({ secret }), { findById } as any);
    await expect(uc.refresh(tok)).rejects.toBeDefined();
    expect(findById).not.toHaveBeenCalled();
  });
  it('env schema rejects short JWT_SECRET', () => {
    const { error } = envValidationSchema.validate(
      { DATABASE_URL: 'postgres://a/b', JWT_SECRET: 'short' },
      { allowUnknown: true, abortEarly: false },
    );
    expect(error).toBeDefined();
  });
});
