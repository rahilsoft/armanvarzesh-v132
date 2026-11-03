import * as fs from 'fs';
import * as path from 'path';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Regression for the credential-less `register` path (handoff 2026-11-03):
 * AuthService.register issued a signed coach token for any username without
 * checking a password or a user store. Tokens from this env-driven service may
 * only come from login() with valid ADMIN_USERS_JSON credentials.
 */
describe('AuthService issues tokens only for verified credentials', () => {
  const saved = { ...process.env };
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'x'.repeat(40);
    process.env.ADMIN_USERS_JSON = JSON.stringify([{ u: 'admin', p: 'right-password', r: 'owner' }]);
  });
  afterEach(() => { process.env = { ...saved }; });

  it('has no register method that mints tokens without credentials', () => {
    expect((AuthService.prototype as any).register).toBeUndefined();
  });

  it('rejects an unknown username', async () => {
    await expect(new AuthService().login({ username: 'anyone', password: 'x' } as any))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a wrong password', async () => {
    await expect(new AuthService().login({ username: 'admin', password: 'wrong-passwor' } as any))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('issues tokens for valid credentials', async () => {
    const t = await new AuthService().login({ username: 'admin', password: 'right-password' } as any);
    expect(typeof t.accessToken).toBe('string');
    expect(t.expiresIn).toBeGreaterThan(0);
  });

  it('no resolver in src calls authService.register', () => {
    const root = path.resolve(__dirname, '..', '..');
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) { if (e.name !== '__tests__' && e.name !== 'node_modules') walk(p); }
        else if (/\.resolver\.ts$/.test(e.name) && /authService\.register\(/.test(fs.readFileSync(p, 'utf8'))) hits.push(p);
      }
    };
    walk(root);
    expect(hits).toEqual([]);
  });
});
