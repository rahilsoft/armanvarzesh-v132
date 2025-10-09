import { createPublicKey, createSign, createVerify } from 'crypto';

function normalizePem(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) throw new Error('Signing key is empty');
  if (trimmed.includes('-----BEGIN')) return trimmed;
  try {
    const decoded = Buffer.from(trimmed, 'base64').toString('utf8');
    return decoded.includes('-----BEGIN') ? decoded : trimmed;
  } catch {
    return trimmed;
  }
}

function parseKeyMap() {
  const sources = [process.env.JWT_KEYS, process.env.JWT_SECRETS];
  for (const source of sources) {
    if (!source) continue;
    try {
      const parsed = JSON.parse(source);
      if (Object.keys(parsed).length > 0) return parsed;
    } catch {
      throw new Error('JWT_KEYS must be valid JSON mapping kid→private key');
    }
  }
  const inline = process.env.JWT_PRIVATE_KEY || process.env.JWT_PRIVATE_PEM;
  if (inline) {
    return { default: inline };
  }
  throw new Error('JWT_KEYS or JWT_PRIVATE_KEY must be configured for RS256 signing');
}

function secondsFrom(input) {
  if (!input) return 0;
  if (typeof input === 'number') return input;
  const value = String(input).trim();
  const match = /^([0-9]+)([smhd])?$/.exec(value);
  if (!match) return Number(value) || 0;
  const amount = Number(match[1]);
  const unit = match[2] || 's';
  switch (unit) {
    case 's': return amount;
    case 'm': return amount * 60;
    case 'h': return amount * 3600;
    case 'd': return amount * 86400;
    default: return amount;
  }
}

function base64urlEncode(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function base64urlDecode(str) {
  return JSON.parse(Buffer.from(str, 'base64url').toString('utf8'));
}

export async function buildIssuerFromEnv() {
  const keyMap = parseKeyMap();
  const alg = process.env.JWT_ALG || 'RS256';
  if (alg !== 'RS256') {
    throw new Error('auth-service only supports RS256 tokens. Set JWT_ALG=RS256');
  }
  const activeKid = process.env.JWT_ACTIVE_KID || Object.keys(keyMap)[0];
  if (!activeKid || !keyMap[activeKid]) {
    throw new Error('Active kid missing from JWT_KEYS. Provide JWT_ACTIVE_KID');
  }
  const issuer = process.env.JWT_ISSUER || 'auth-service';
  const audience = process.env.JWT_AUDIENCE || 'arman-clients';
  const defaultExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  const defaultTtl = secondsFrom(defaultExpiresIn) || 7 * 24 * 3600;

  const entries = new Map();
  for (const [kid, raw] of Object.entries(keyMap)) {
    const pem = normalizePem(raw);
    const publicKey = createPublicKey({ key: pem, format: 'pem' });
    const publicPem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
    const jwk = publicKey.export({ format: 'jwk' });
    entries.set(kid, {
      kid,
      privateKey: pem,
      publicPem,
      jwk: { ...jwk, kid, alg, use: 'sig' },
    });
  }

  function pickEntry(kid) {
    const entry = entries.get(kid);
    if (!entry) throw new Error(`Unknown signing kid: ${kid}`);
    return entry;
  }

  return {
    alg,
    activeKid,
    defaultExpiresIn,
    async sign(payload, opts = {}) {
      const kid = opts.kid || activeKid;
      const entry = pickEntry(kid);
      const ttl = secondsFrom(opts.expiresIn || defaultTtl) || defaultTtl;
      const now = Math.floor(Date.now() / 1000);
      const body = { ...payload, iat: now };
      if (issuer) body.iss = issuer;
      if (audience) body.aud = audience;
      if (ttl > 0) body.exp = now + ttl;
      const header = { alg, typ: 'JWT', kid };
      const encodedHeader = base64urlEncode(header);
      const encodedPayload = base64urlEncode(body);
      const signingInput = `${encodedHeader}.${encodedPayload}`;
      const signer = createSign('RSA-SHA256');
      signer.update(signingInput);
      signer.end();
      const signature = signer.sign(entry.privateKey, 'base64url');
      return `${signingInput}.${signature}`;
    },
    async verify(token) {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('invalid_token');
      const [encodedHeader, encodedPayload, signature] = parts;
      const header = base64urlDecode(encodedHeader);
      const kid = header.kid || activeKid;
      const entry = pickEntry(kid);
      const verifier = createVerify('RSA-SHA256');
      verifier.update(`${encodedHeader}.${encodedPayload}`);
      verifier.end();
      if (!verifier.verify(entry.publicPem, signature, 'base64url')) {
        throw new Error('invalid_signature');
      }
      const payload = base64urlDecode(encodedPayload);
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && now > payload.exp) {
        throw new Error('token_expired');
      }
      if (issuer && payload.iss && payload.iss !== issuer) {
        throw new Error('issuer_mismatch');
      }
      if (audience && payload.aud && payload.aud !== audience) {
        throw new Error('audience_mismatch');
      }
      return payload;
    },
    async jwks() {
      return { keys: Array.from(entries.values()).map((e) => e.jwk) };
    },
  };
}
