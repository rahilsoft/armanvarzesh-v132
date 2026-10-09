import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { identityFromHandshake, identityFromReq, identityFromToken } from './auth/req-user';

const SECRET = 'test-secret-at-least-16-chars';
const sign = (payload: object, secret = SECRET) =>
  jwt.sign(payload, secret, { algorithm: 'HS256' });

describe('chat identity', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
  });
  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('reads the user id from a verified token', () => {
    expect(identityFromToken(sign({ sub: 'u1' }))).toEqual({ userId: 'u1', role: 'user' });
  });

  it('takes the coach role from the signed token', () => {
    expect(identityFromToken(sign({ sub: 'c1', role: 'coach' }))).toEqual({
      userId: 'c1',
      role: 'coach',
    });
  });

  it('rejects a missing, malformed or wrongly-signed token', () => {
    expect(() => identityFromToken(undefined)).toThrow(UnauthorizedException);
    expect(() => identityFromToken('not-a-jwt')).toThrow(UnauthorizedException);
    expect(() => identityFromToken(sign({ sub: 'u1' }, 'another-secret-16-chars'))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects an unsigned (alg=none) token', () => {
    const token = jwt.sign({ sub: 'u1' }, '', { algorithm: 'none' });
    expect(() => identityFromToken(token)).toThrow(UnauthorizedException);
  });

  it('rejects a token with no usable subject', () => {
    expect(() => identityFromToken(sign({ foo: 'bar' }))).toThrow(UnauthorizedException);
  });

  describe('handshake', () => {
    // Regression: userId/role used to be read straight from the query string,
    // so any client could connect as any user and claim the coach role.
    it('ignores userId and role query params', () => {
      const client = {
        handshake: { query: { userId: 'victim', role: 'coach', threadId: 't1' }, headers: {} },
      };
      expect(() => identityFromHandshake(client)).toThrow(UnauthorizedException);
    });

    it('accepts a token from handshake auth', () => {
      const client = {
        handshake: { auth: { token: sign({ sub: 'u1' }) }, query: { userId: 'victim' }, headers: {} },
      };
      expect(identityFromHandshake(client).userId).toBe('u1');
    });

    it('accepts a bearer token from handshake headers', () => {
      const client = {
        handshake: { headers: { authorization: `Bearer ${sign({ sub: 'u2' })}` }, query: {} },
      };
      expect(identityFromHandshake(client).userId).toBe('u2');
    });

    it('does not let a query param override the signed role', () => {
      const client = {
        handshake: { auth: { token: sign({ sub: 'u1' }) }, query: { role: 'coach' }, headers: {} },
      };
      expect(identityFromHandshake(client).role).toBe('user');
    });
  });

  describe('http', () => {
    it('requires a bearer Authorization header', () => {
      expect(() => identityFromReq({ headers: {} })).toThrow(UnauthorizedException);
      expect(() => identityFromReq({ headers: { authorization: 'Basic abc' } })).toThrow(
        UnauthorizedException,
      );
    });

    it('accepts a valid bearer header', () => {
      const req = { headers: { authorization: `Bearer ${sign({ sub: 'u9' })}` } };
      expect(identityFromReq(req).userId).toBe('u9');
    });
  });
});

describe('ChatService.assertParticipant', () => {
  const findUnique = jest.fn();
  // Exercise the real method against a stubbed Prisma client.
  const svc: any = Object.create(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./chat.service').ChatService.prototype,
  );
  svc.prisma = { participant: { findUnique } };

  afterEach(() => jest.clearAllMocks());

  it('allows a member of the thread', async () => {
    findUnique.mockResolvedValue({ id: 'p1', threadId: 't1', userId: 'u1', role: 'user' });
    await expect(svc.assertParticipant('t1', 'u1')).resolves.toMatchObject({ userId: 'u1' });
    expect(findUnique).toHaveBeenCalledWith({
      where: { threadId_userId: { threadId: 't1', userId: 'u1' } },
    });
  });

  // Regression: knowing a thread id used to be enough to join and read it.
  it('rejects a non-member', async () => {
    findUnique.mockResolvedValue(null);
    await expect(svc.assertParticipant('t1', 'outsider')).rejects.toThrow(ForbiddenException);
  });

  it('rejects a blank thread or user id without querying', async () => {
    await expect(svc.assertParticipant('', 'u1')).rejects.toThrow(ForbiddenException);
    await expect(svc.assertParticipant('t1', '')).rejects.toThrow(ForbiddenException);
    expect(findUnique).not.toHaveBeenCalled();
  });
});
