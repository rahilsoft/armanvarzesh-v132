import { createPublicKey } from 'crypto';
import { decodeProtectedHeader, exportJWK, importPKCS8, jwtVerify, SignJWT } from 'jose';

const DEFAULT_EXPIRES_SECONDS = 7 * 24 * 60 * 60;

function parseSecrets(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
    if (parsed && typeof parsed === 'object') {
      return Object.values(parsed).map((value) => String(value));
    }
  } catch {}
  return String(raw)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseKeySpecs(env) {
  const specs = [];
  if (env.JWT_KEYS) {
    let parsed;
    try {
      parsed = JSON.parse(env.JWT_KEYS);
    } catch (err) {
      throw new Error('JWT_KEYS must be valid JSON');
    }
    if (Array.isArray(parsed)) {
      parsed.forEach((value, index) => {
        specs.push({ kid: `k${index + 1}`, privatePEM: String(value) });
      });
    } else if (parsed && typeof parsed === 'object') {
      Object.entries(parsed).forEach(([kid, value]) => {
        specs.push({ kid, privatePEM: String(value) });
      });
    } else {
      throw new Error('JWT_KEYS must be an object mapping kid to PEM value or an array');
    }
  }
  if (!specs.length && env.JWT_SECRETS) {
    const list = parseSecrets(env.JWT_SECRETS);
    list.forEach((value, index) => {
      specs.push({ kid: `k${index + 1}`, privatePEM: value });
    });
  }
  return specs;
}

function parseExpires(raw) {
  if (!raw) return DEFAULT_EXPIRES_SECONDS;
  if (typeof raw === 'number') return raw;
  const str = String(raw).trim();
  if (!str) return DEFAULT_EXPIRES_SECONDS;
  if (/^\d+$/.test(str)) return parseInt(str, 10);
  const match = str.match(/^(\d+)([smhd])$/i);
  if (!match) {
    throw new Error('JWT_EXPIRES_IN must be a number of seconds or formatted like 15m/12h/7d');
  }
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
  return value * multipliers[unit];
}

export async function buildKeyStore(env = process.env) {
  const algorithm = env.JWT_ALG || 'RS256';
  if (algorithm !== 'RS256') {
    throw new Error(`auth-service only supports RS256 but received ${algorithm}`);
  }
  const specs = parseKeySpecs(env);
  if (!specs.length) {
    throw new Error('JWT_KEYS or JWT_SECRETS must provide at least one RS256 private key');
  }

  const entries = [];
  for (const spec of specs) {
    if (!spec.privatePEM || !spec.privatePEM.includes('PRIVATE KEY')) {
      throw new Error(`JWT key ${spec.kid} is not a valid PEM encoded private key`);
    }
    const privateKey = await importPKCS8(spec.privatePEM, algorithm);
    const publicKey = createPublicKey(spec.privatePEM);
    const jwk = await exportJWK(publicKey);
    jwk.kid = spec.kid;
    jwk.alg = algorithm;
    jwk.use = 'sig';
    entries.push({ kid: spec.kid, privateKey, publicKey, jwk });
  }

  const store = new Map(entries.map((entry) => [entry.kid, entry]));
  const activeKid = env.JWT_ACTIVE_KID || entries[0].kid;
  if (!store.has(activeKid)) {
    throw new Error(`Active JWT kid ${activeKid} not found in configured keys`);
  }

  const issuer = env.JWT_ISSUER || 'armanfit';
  const audience = env.JWT_AUDIENCE || 'armanfit-users';
  const expiresInSeconds = parseExpires(env.JWT_EXPIRES_IN);

  return {
    algorithm,
    activeKid,
    ttlSeconds: expiresInSeconds,
    jwks: { keys: entries.map((entry) => entry.jwk) },
    listKids: () => Array.from(store.keys()),
    async sign(payload, opts = {}) {
      const kid = opts.kid || activeKid;
      const expSeconds = opts.expiresInSec || expiresInSeconds;
      const entry = store.get(kid);
      if (!entry) throw new Error(`Unknown kid ${kid}`);
      return new SignJWT(payload)
        .setProtectedHeader({ alg: algorithm, kid })
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(audience)
        .setExpirationTime(`${expSeconds}s`)
        .sign(entry.privateKey);
    },
    async verify(token) {
      const header = decodeProtectedHeader(token);
      const kid = header?.kid || activeKid;
      const entry = store.get(kid);
      if (!entry) {
        throw new Error(`Unknown kid ${kid}`);
      }
      return jwtVerify(token, entry.publicKey, {
        algorithms: [algorithm],
        issuer,
        audience,
      });
    },
  };
}
