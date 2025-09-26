import { AuthService } from './src/auth/auth.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  const svc = new AuthService();
  beforeAll(() => {
    const hash = bcrypt.hashSync('secret123', 8);
    process.env.ADMIN_USERS_JSON = JSON.stringify([{ u: 'admin', h: hash, r: 'owner' }]);
  });

  it('login with valid credentials returns tokens', async () => {
    const tokens = await svc.login({ username: 'admin', password: 'secret123' } as any);
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
    expect(typeof tokens.expiresIn).toBe('number');
  });

  it('login with invalid credentials throws', async () => {
    await expect(svc.login({ username: 'admin', password: 'wrong' } as any)).rejects.toBeTruthy();
  });

  it('refresh with valid token issues new pair', async () => {
    const t1 = await svc.login({ username: 'admin', password: 'secret123' } as any);
    const t2 = await svc.refresh(t1.refreshToken);
    expect(t2.accessToken).not.toEqual(t1.accessToken);
    expect(t2.refreshToken).not.toEqual(t1.refreshToken);
  });
});
