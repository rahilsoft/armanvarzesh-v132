import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAuthService } from '../user-auth.service';

/**
 * Parity tests for the Auth reference domain. These exercise the security-
 * critical behaviour that was ported from services/auth-service: argon2
 * hashing, selector/verifier refresh, rotation, reuse/theft detection, and
 * constant-time login. Prisma is replaced with a small in-memory store so the
 * logic is validated without a live database (integration/E2E against real
 * Postgres run in CI).
 */

interface UserRow { id: number; email: string; passwordHash: string | null; name: string; }
interface RtRow {
  id: number; userId: number; selector: string; verifierHash: string;
  createdAt: Date; expiresAt: Date; revokedAt: Date | null; replacedById: number | null;
  userAgent: string | null; ip: string | null;
}

function makePrismaMock() {
  const users: UserRow[] = [];
  const tokens: RtRow[] = [];
  let userSeq = 1;
  let tokenSeq = 1;

  return {
    _users: users,
    _tokens: tokens,
    user: {
      findUnique: async ({ where }: any) =>
        users.find((u) => (where.id !== undefined ? u.id === where.id : u.email === where.email)) ?? null,
      create: async ({ data }: any) => {
        const row: UserRow = { id: userSeq++, email: data.email, passwordHash: data.passwordHash ?? null, name: data.name };
        users.push(row);
        return row;
      },
    },
    refreshToken: {
      findUnique: async ({ where }: any) => tokens.find((t) => t.selector === where.selector) ?? null,
      create: async ({ data }: any) => {
        const row: RtRow = {
          id: tokenSeq++, userId: data.userId, selector: data.selector, verifierHash: data.verifierHash,
          createdAt: new Date(), expiresAt: data.expiresAt, revokedAt: null, replacedById: null,
          userAgent: data.userAgent ?? null, ip: data.ip ?? null,
        };
        tokens.push(row);
        return row;
      },
      update: async ({ where, data }: any) => {
        const row = tokens.find((t) => t.id === where.id)!;
        Object.assign(row, data);
        return row;
      },
      updateMany: async ({ where, data }: any) => {
        let count = 0;
        for (const t of tokens) {
          if (t.userId === where.userId && (where.revokedAt === null ? t.revokedAt === null : true)) {
            Object.assign(t, data);
            count++;
          }
        }
        return { count };
      },
    },
  };
}

function makeService() {
  const prisma = makePrismaMock();
  const jwt = new JwtService({ secret: 'test-secret-at-least-16-chars-long' });
  const svc = new UserAuthService(prisma as any, jwt);
  return { prisma, jwt, svc };
}

describe('UserAuthService (Auth reference domain)', () => {
  it('registers a user, hashes the password with argon2, and issues a selector.verifier refresh token', async () => {
    const { prisma, svc } = makeService();
    const res = await svc.register('a@example.com', 'correct horse battery');
    expect(res.user.email).toBe('a@example.com');
    expect(res.accessToken.split('.')).toHaveLength(3); // JWT
    expect(res.refreshToken).toContain('.');
    const stored = prisma._users[0];
    expect(stored.passwordHash).toMatch(/^\$argon2/);
    expect(stored.passwordHash).not.toBe('correct horse battery');
  });

  it('rejects a duplicate email', async () => {
    const { svc } = makeService();
    await svc.register('dup@example.com', 'password123');
    await expect(svc.register('dup@example.com', 'password123')).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in with the correct password and rejects a wrong one', async () => {
    const { svc } = makeService();
    await svc.register('login@example.com', 'right-password');
    const ok = await svc.login('login@example.com', 'right-password');
    expect(ok.accessToken).toBeTruthy();
    await expect(svc.login('login@example.com', 'wrong-password')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('does not leak user existence: unknown email fails the same way as a wrong password', async () => {
    const { svc } = makeService();
    await expect(svc.login('nobody@example.com', 'whatever')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rotates the refresh token: the old token is revoked and linked to its replacement', async () => {
    const { prisma, svc } = makeService();
    const reg = await svc.register('rot@example.com', 'password123');
    const rotated = await svc.refresh(reg.refreshToken);
    expect(rotated.refreshToken).not.toBe(reg.refreshToken);
    const oldSelector = reg.refreshToken.split('.')[0];
    const oldRow = prisma._tokens.find((t) => t.selector === oldSelector)!;
    expect(oldRow.revokedAt).not.toBeNull();
    expect(oldRow.replacedById).not.toBeNull();
  });

  it('detects theft: presenting an already-revoked token revokes the whole family', async () => {
    const { prisma, svc } = makeService();
    const reg = await svc.register('theft@example.com', 'password123');
    await svc.refresh(reg.refreshToken); // first rotation revokes the original
    // Present the original (now revoked) token again → reuse/theft.
    await expect(svc.refresh(reg.refreshToken)).rejects.toThrow(/reuse detected/i);
    // Every refresh token for that user is now revoked.
    const userId = prisma._users[0].id;
    expect(prisma._tokens.filter((t) => t.userId === userId).every((t) => t.revokedAt !== null)).toBe(true);
  });

  it('rejects a malformed refresh token', async () => {
    const { svc } = makeService();
    await expect(svc.refresh('not-a-valid-token')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
