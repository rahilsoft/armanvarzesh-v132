import { createPublicKey } from 'crypto';
import { createRemoteJWKSet, decodeProtectedHeader, jwtVerify } from 'jose';
import { createLocalJWKSet } from 'jose/jwks/local';

function parsePemKeyMap(raw) {
  const map = new Map();
  if (!raw) return map;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error('JWT_PUBLIC_KEYS must be valid JSON');
  }
  if (Array.isArray(parsed)) {
    parsed.forEach((value, index) => {
      if (typeof value !== 'string' || !value.trim()) {
        throw new Error('JWT_PUBLIC_KEYS array entries must be non-empty strings');
      }
      map.set(`k${index + 1}`, createPublicKey(value));
    });
    return map;
  }
  Object.entries(parsed).forEach(([kid, value]) => {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`JWT_PUBLIC_KEYS entry for ${kid} must be a non-empty string`);
    }
    map.set(kid, createPublicKey(value));
  });
  return map;
}

export function buildJwtVerifier(env = process.env) {
  const algorithm = env.JWT_ALG || 'RS256';
  if (algorithm !== 'RS256') {
    throw new Error(`api-gateway only supports RS256 verification but received ${algorithm}`);
  }
  const issuer = env.JWT_ISSUER || undefined;
  const audience = env.JWT_AUDIENCE || undefined;

  const jwksUrl = env.JWKS_URL ? env.JWKS_URL.trim() : '';
  const remoteSet = jwksUrl ? createRemoteJWKSet(new URL(jwksUrl)) : null;

  let localJwks = null;
  if (!remoteSet && env.PUBLIC_JWKS_JSON) {
    try {
      const json = JSON.parse(env.PUBLIC_JWKS_JSON);
      localJwks = createLocalJWKSet(json);
    } catch (err) {
      throw new Error('Failed to parse PUBLIC_JWKS_JSON');
    }
  }

  const pemKeys = new Map();
  if (env.JWT_PUBLIC_KEYS) {
    const parsed = parsePemKeyMap(env.JWT_PUBLIC_KEYS);
    parsed.forEach((value, key) => pemKeys.set(key, value));
  }
  const singleKey = env.JWT_PUBLIC_KEY || env.JWKS_PUBLIC_PEM;
  if (singleKey && singleKey.trim()) {
    pemKeys.set('default', createPublicKey(singleKey));
  }

  const hasVerifier = Boolean(remoteSet || localJwks || pemKeys.size > 0);

  async function verify(token) {
    if (!token) {
      throw new Error('missing_token');
    }
    const options = {
      algorithms: [algorithm],
      issuer,
      audience,
    };
    if (remoteSet) {
      return jwtVerify(token, remoteSet, options);
    }
    if (localJwks) {
      return jwtVerify(token, localJwks, options);
    }
    const header = decodeProtectedHeader(token);
    if (header?.kid && pemKeys.has(header.kid)) {
      return jwtVerify(token, pemKeys.get(header.kid), options);
    }
    if (pemKeys.has('default')) {
      return jwtVerify(token, pemKeys.get('default'), options);
    }
    throw new Error('unknown_kid');
  }

  return { hasVerifier, verify };
}
