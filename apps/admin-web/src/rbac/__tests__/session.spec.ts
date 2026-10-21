import { sessionFromToken, decodeClaims, tokenExpiryMs } from '../session';

function makeToken(claims: object): string {
  const enc = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${enc({ alg: 'HS256', typ: 'JWT' })}.${enc(claims)}.sig`;
}
const NOW = 1_800_000_000_000;
const future = Math.floor(NOW / 1000) + 3600;

describe('sessionFromToken', () => {
  it('no token => unauthenticated', () => {
    expect(sessionFromToken(null, NOW).status).toBe('unauthenticated');
  });
  it('malformed token => unauthenticated', () => {
    expect(sessionFromToken('abc', NOW).status).toBe('unauthenticated');
    expect(sessionFromToken('a.!!!.c', NOW).status).toBe('unauthenticated');
  });
  it('expired token => unauthenticated', () => {
    const t = makeToken({ sub: 'u', role: 'owner', exp: Math.floor(NOW / 1000) - 1 });
    expect(sessionFromToken(t, NOW).status).toBe('unauthenticated');
  });
  it('valid token => roles from role claim', () => {
    const s = sessionFromToken(makeToken({ sub: 'ali', role: 'coach', exp: future }), NOW);
    expect(s).toEqual({ status: 'authenticated', roles: ['coach'], subject: 'ali' });
  });
  it('drops unknown roles and supports a roles array', () => {
    const s = sessionFromToken(makeToken({ sub: 'x', roles: ['owner', 'hacker'], exp: future }), NOW);
    expect(s.roles).toEqual(['owner']);
  });
  it('decodeClaims handles UTF-8 payloads', () => {
    expect(decodeClaims(makeToken({ sub: 'علی' }))?.sub).toBe('علی');
  });
  it('token without exp => unauthenticated', () => {
    expect(sessionFromToken(makeToken({ sub: 'u', role: 'owner' }), NOW).status).toBe('unauthenticated');
  });
  it('tokenExpiryMs reads exp in ms', () => {
    expect(tokenExpiryMs(makeToken({ exp: future }))).toBe(future * 1000);
    expect(tokenExpiryMs(null)).toBeNull();
  });
});
