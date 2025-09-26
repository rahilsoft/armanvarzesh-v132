import { AdminJwtGuard } from '../src/auth/admin.jwt.guard';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { generateKeyPairSync } from 'crypto';

// Helper to build an ExecutionContext-like object for the guard
function mockCtx(token?: string) {
  const req: any = { headers: {} };
  if (token) req.headers['authorization'] = 'Bearer ' + token;
  return { switchToHttp: () => ({ getRequest: () => req }) } as any;
}

describe('AdminJwtGuard (RS256)', () => {
  let privateKey: string;
  let publicKeyPath: string;
  beforeAll(() => {
    // Generate RSA key pair for testing
    const { privateKey: priv, publicKey: pub } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    });
    privateKey = priv;
    // Write public key to temp file
    publicKeyPath = '/tmp/test-admin-jwt.pub';
    fs.writeFileSync(publicKeyPath, pub);
    process.env.ADMIN_JWT_PUBLIC_KEY_PATH = publicKeyPath;
  });

  afterAll(() => {
    try { fs.unlinkSync(publicKeyPath); } catch {}
  });

  it('passes with valid RS256 token', () => {
    const guard = new AdminJwtGuard();
    // Sign token using private key (RS256)
    const token = jwt.sign({ sub: 'admin', role: 'owner' }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
    const ok = guard.canActivate(mockCtx(token));
    expect(ok).toBe(true);
  });

  it('fails with invalid token', () => {
    const guard = new AdminJwtGuard();
    expect(() => guard.canActivate(mockCtx('bad.token'))).toThrow();
  });

  it('fails when no token provided', () => {
    const guard = new AdminJwtGuard();
    expect(() => guard.canActivate(mockCtx())).toThrow();
  });
});