import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'crypto';
import { createRequire } from 'module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const moduleApi = require('module');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.resolve(__dirname, '__fixtures__');
const originalLoad = moduleApi._load;
moduleApi._load = function(request, parent, isMain) {
  if (request === '@nestjs/common') {
    return require(path.resolve(fixturesPath, 'nestjs-common-stub.cjs'));
  }
  if (request === 'jsonwebtoken') {
    return require(path.resolve(fixturesPath, 'jsonwebtoken-stub.cjs'));
  }
  return originalLoad.call(this, request, parent, isMain);
};
const { TokenService } = require(path.resolve(fixturesPath, 'token-service.cjs'));

function snapshotEnv() {
  return {
    JWT_KEYS: process.env.JWT_KEYS,
    JWT_SECRETS: process.env.JWT_SECRETS,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    JWT_PRIVATE_PEM: process.env.JWT_PRIVATE_PEM,
    JWT_ACTIVE_KID: process.env.JWT_ACTIVE_KID,
  };
}

function restoreEnv(snapshot) {
  for (const [key, value] of Object.entries(snapshot)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function createKeyPem() {
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return privateKey.toString();
}

test('TokenService signs and verifies with the active kid', () => {
  const snapshot = snapshotEnv();
  try {
    const key = createKeyPem();
    process.env.JWT_KEYS = JSON.stringify({ k1: key });
    process.env.JWT_ACTIVE_KID = 'k1';
    const service = new TokenService();
    const token = service.sign({ sub: 'user-123', role: 'user' }, '1h');
    const payload = service.verify(token);
    assert.equal(payload.sub, 'user-123');
    assert.equal(payload.role, 'user');
  } finally {
    restoreEnv(snapshot);
  }
});

test('TokenService verifies tokens after rotation', () => {
  const snapshot = snapshotEnv();
  try {
    const keyA = createKeyPem();
    const keyB = createKeyPem();
    process.env.JWT_KEYS = JSON.stringify({ kidA: keyA, kidB: keyB });
    process.env.JWT_ACTIVE_KID = 'kidA';
    const first = new TokenService();
    const tokenA = first.sign({ sub: 'legacy-user' });

    process.env.JWT_ACTIVE_KID = 'kidB';
    const rotated = new TokenService();
    const tokenB = rotated.sign({ sub: 'new-user' });

    const legacyPayload = rotated.verify(tokenA);
    const newPayload = rotated.verify(tokenB);
    assert.equal(legacyPayload.sub, 'legacy-user');
    assert.equal(newPayload.sub, 'new-user');
  } finally {
    restoreEnv(snapshot);
  }
});

test('TokenService requires configured keys', () => {
  const snapshot = snapshotEnv();
  try {
    delete process.env.JWT_KEYS;
    delete process.env.JWT_SECRETS;
    delete process.env.JWT_PRIVATE_KEY;
    delete process.env.JWT_PRIVATE_PEM;
    assert.throws(() => new TokenService(), /No RS256 signing keys configured/);
  } finally {
    restoreEnv(snapshot);
  }
});
