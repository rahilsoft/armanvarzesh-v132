import { randomBytes, randomUUID } from 'crypto';
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';

/**
 * Canonical first-party user authentication.
 *
 * Ported verbatim (behaviour-preserving) from the former services/auth-service
 * into the modular monolith. The only substantive change is the persistence
 * layer: the monolith core uses Int primary keys, so `userId`/`replacedById`
 * are numbers here. The security design is unchanged:
 *  - passwords hashed with argon2 (stored on User.passwordHash)
 *  - refresh tokens use the split selector/verifier model with rotation and
 *    reuse/theft detection
 *  - access tokens carry a `jti` for revocation
 *  - login timing is equalised against a dummy hash to avoid user-enumeration
 *
 * Admin authentication (env-driven, see AuthService) is a separate path and is
 * intentionally left untouched.
 */

/** Public-safe view of an authenticated user. */
export interface AuthUser {
  id: number;
  email: string;
}

/** Access-token claims embedded in every issued JWT. */
export interface AccessTokenClaims {
  sub: string;
  email: string;
  /** Unique token id, used for blacklist/revocation on logout. */
  jti: string;
}

/** Result returned by register / login / refresh. */
export interface AuthResult {
  user: AuthUser;
  accessToken: string;
  /** Opaque `selector.verifier` refresh token. Store httpOnly on the client. */
  refreshToken: string;
  /** Absolute expiry of the refresh token. */
  refreshExpiresAt: Date;
}

/** Optional request context persisted alongside a refresh token. */
export interface SessionContext {
  userAgent?: string;
  ip?: string;
}

const ACCESS_TTL = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TTL_MS = Number(process.env.REFRESH_TTL_MS || 1000 * 60 * 60 * 24 * 7); // 7d

@Injectable()
export class UserAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name?: string,
    ctx: SessionContext = {},
  ): Promise<AuthResult> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: { email, passwordHash, name: name ?? email.split('@')[0] },
    });
    return this.issueTokens(user, ctx);
  }

  async login(email: string, password: string, ctx: SessionContext = {}): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Verify against a real-looking hash on the miss path too, to keep timing
    // uniform and avoid user-enumeration via response latency.
    const hash = user?.passwordHash ?? DUMMY_HASH;
    const ok = await argon2.verify(hash, password);
    if (!user || !user.passwordHash || !ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueTokens(user, ctx);
  }

  /**
   * Rotate a refresh token. The client presents `selector.verifier`; we look up
   * the row by its public `selector`, verify the secret half, then rotate
   * (revoke old, issue new). Presenting an already-revoked selector is treated
   * as token theft — every refresh token for that user is revoked.
   */
  async refresh(presentedToken: string, ctx: SessionContext = {}): Promise<AuthResult> {
    const parsed = splitRefreshToken(presentedToken);
    if (!parsed) throw new UnauthorizedException('Malformed refresh token');
    const { selector, verifier } = parsed;

    const record = await this.prisma.refreshToken.findUnique({ where: { selector } });
    if (!record) throw new UnauthorizedException('Invalid refresh token');

    // Reuse of a revoked token => probable theft: nuke the whole family.
    if (record.revokedAt) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    if (record.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const validVerifier = await argon2.verify(record.verifierHash, verifier);
    if (!validVerifier) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.user.findUnique({ where: { id: record.userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const result = await this.issueTokens(user, ctx);
    // Rotate: revoke the presented token and link it to its replacement.
    const replacement = await this.prisma.refreshToken.findUnique({
      where: { selector: splitRefreshToken(result.refreshToken)!.selector },
    });
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date(), replacedById: replacement?.id ?? null },
    });
    return result;
  }

  /** Issue a fresh access token (with a `jti`) and a new refresh token row. */
  async issueTokens(user: { id: number; email: string }, ctx: SessionContext = {}): Promise<AuthResult> {
    const jti = randomUUID();
    const claims: AccessTokenClaims = { sub: String(user.id), email: user.email, jti };
    const accessToken = await this.jwt.signAsync(claims, { expiresIn: ACCESS_TTL });

    const selector = randomToken(24);
    const verifier = randomToken(48);
    const verifierHash = await argon2.hash(verifier);
    const refreshExpiresAt = new Date(Date.now() + REFRESH_TTL_MS);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        selector,
        verifierHash,
        expiresAt: refreshExpiresAt,
        userAgent: ctx.userAgent ?? null,
        ip: ctx.ip ?? null,
      },
    });

    return {
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken: `${selector}.${verifier}`,
      refreshExpiresAt,
    };
  }

  /** Revoke every active refresh token for a user (e.g. "log out everywhere"). */
  async revokeAll(userId: number): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}

/** A constant argon2 hash of a random secret, used to equalise login timing. */
const DUMMY_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHRzb21lc2FsdA$RdescudvJCsgt3ub+b+dWRWJTmawQUgQchz0isgvbRA';

function randomToken(byteLen: number): string {
  return randomBytes(byteLen).toString('base64url');
}

function splitRefreshToken(token: string): { selector: string; verifier: string } | null {
  const idx = token.indexOf('.');
  if (idx <= 0 || idx === token.length - 1) return null;
  return { selector: token.slice(0, idx), verifier: token.slice(idx + 1) };
}
