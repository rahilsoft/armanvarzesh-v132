const { createSign, createVerify } = require('crypto');

function b64url(input) {
  if (typeof input !== 'string') input = JSON.stringify(input);
  return Buffer.from(input).toString('base64url');
}

function decodePart(part) {
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
}

function parseExpires(value) {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  const match = /^([0-9]+)([smhd])?$/.exec(String(value));
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

function sign(payload, privateKey, options = {}) {
  const header = { alg: options.algorithm || 'RS256', typ: 'JWT' };
  if (options.keyid) header.kid = options.keyid;
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now };
  if (options.issuer) body.iss = options.issuer;
  if (options.audience) body.aud = options.audience;
  const ttl = parseExpires(options.expiresIn);
  if (ttl > 0) body.exp = now + ttl;
  const signingInput = `${b64url(header)}.${b64url(body)}`;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(privateKey, 'base64url');
  return `${signingInput}.${signature}`;
}

function verify(token, publicKey, options = {}) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('invalid_token');
  const [encodedHeader, encodedPayload, signature] = parts;
  const verifier = createVerify('RSA-SHA256');
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  verifier.end();
  if (!verifier.verify(publicKey, signature, 'base64url')) {
    throw new Error('invalid_signature');
  }
  const payload = decodePart(encodedPayload);
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now > payload.exp) throw new Error('token_expired');
  if (options.issuer && payload.iss !== options.issuer) throw new Error('issuer_mismatch');
  if (options.audience && payload.aud !== options.audience) throw new Error('audience_mismatch');
  return payload;
}

function decode(token, opts = {}) {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const payload = decodePart(parts[1]);
  const header = decodePart(parts[0]);
  return opts.complete ? { payload, header } : payload;
}

module.exports = { sign, verify, decode };
