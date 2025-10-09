import { generateKeyPairSync } from 'crypto';
import { jest } from '@jest/globals';

const managedKeys = [
  'JWT_KEYS',
  'JWT_SECRETS',
  'JWT_PRIVATE_KEY',
  'JWT_PRIVATE_PEM',
  'JWT_ACTIVE_KID',
  'JWT_ALG',
  'JWT_EXPIRES_IN',
  'JWT_ISSUER',
  'JWT_AUDIENCE',
];

const resetEnv = () => {
  for (const key of managedKeys) {
    delete process.env[key];
  }
};

const restoreEnv = (snapshot) => {
  for (const key of managedKeys) {
    const value = snapshot.get(key);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
};

describe('buildIssuerFromEnv', () => {
  const snapshot = new Map();

  beforeAll(() => {
    for (const key of managedKeys) {
      snapshot.set(key, process.env[key]);
    }
  });

  beforeEach(() => {
    resetEnv();
    jest.resetModules();
  });

  afterAll(() => {
    restoreEnv(snapshot);
  });

  function createPrivateKey() {
    const { privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      publicKeyEncoding: { type: 'spki', format: 'pem' },
    });
    return privateKey.toString();
  }

  it('signs and verifies RS256 tokens and exposes JWKS', async () => {
    const pem = createPrivateKey();
    process.env.JWT_KEYS = JSON.stringify({ kid1: pem });
    process.env.JWT_ACTIVE_KID = 'kid1';
    const { buildIssuerFromEnv } = await import('../src/jwt-issuer.mjs');
    const issuer = await buildIssuerFromEnv();
    const token = await issuer.sign({ sub: 'user-1', scope: 'basic' });
    const payload = await issuer.verify(token);
    expect(payload.sub).toBe('user-1');
    expect(payload.scope).toBe('basic');
    const jwks = await issuer.jwks();
    expect(jwks.keys).toHaveLength(1);
    expect(jwks.keys[0].kid).toBe('kid1');
    expect(jwks.keys[0].alg).toBe('RS256');
  });

  it('supports rotating to a new kid while keeping previous keys available', async () => {
    const pem1 = createPrivateKey();
    const pem2 = createPrivateKey();
    process.env.JWT_KEYS = JSON.stringify({ old: pem1, current: pem2 });
    process.env.JWT_ACTIVE_KID = 'old';
    const { buildIssuerFromEnv } = await import('../src/jwt-issuer.mjs');
    const first = await buildIssuerFromEnv();
    const legacyToken = await first.sign({ sub: 'legacy' });

    process.env.JWT_ACTIVE_KID = 'current';
    const rotated = await buildIssuerFromEnv();
    const newToken = await rotated.sign({ sub: 'fresh' });

    const legacyPayload = await rotated.verify(legacyToken);
    const newPayload = await rotated.verify(newToken);
    const jwks = await rotated.jwks();
    const kids = jwks.keys.map((k) => k.kid).sort();

    expect(legacyPayload.sub).toBe('legacy');
    expect(newPayload.sub).toBe('fresh');
    expect(kids).toEqual(['current', 'old']);
  });

  it('throws when configuration is missing', async () => {
    const { buildIssuerFromEnv } = await import('../src/jwt-issuer.mjs');
    await expect(buildIssuerFromEnv()).rejects.toThrow('JWT_KEYS or JWT_PRIVATE_KEY must be configured');
  });
});
