import { randomBytes } from 'crypto';
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { TokenRevocationService } from './token-revocation.service';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  constructor(
    private readonly jwt: JwtService,
    private readonly revocationService: TokenRevocationService
  ) {}

  async register(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');
    const passwordHash = await argon2.hash(password);
    const user = await this.prisma.user.create({ data: { email, passwordHash } });
    const tokens = await this.issueTokens(user.id, user.email, undefined, undefined, undefined, undefined);
    return { user: { id: user.id, email: user.email }, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.issueTokens(user.id, user.email, undefined, undefined, undefined, undefined);
    return { user: { id: user.id, email: user.email }, ...tokens };
  }

  async refresh(userId: string, refreshToken: string) {
    const tokenHash = await argon2.hash(refreshToken);
    const token = await this.prisma.refreshToken.findFirst({ where: { userId } });
    if (!token) throw new UnauthorizedException('No refresh token');
    // Simplified: compare just by verifying (since stored is hash)
    const valid = await argon2.verify(token.tokenHash, refreshToken);
    if (!valid || (token.expiresAt && token.expiresAt < new Date())) {
      throw new UnauthorizedException('Refresh token invalid/expired');
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const tokens = await this.issueTokens(user.id, user.email, token.id);
    return { user: { id: user.id, email: user.email }, ...tokens };
  }

  async issueTokens(userId: string, email: string, existingRefreshId?: string, deviceId?: string, userAgent?: string, ip?: string) {
    const accessTtl = process.env.JWT_EXPIRES_IN || '15m';
    const refreshTtlMs = Number(process.env.REFRESH_TTL_MS || (1000 * 60 * 60 * 24 * 7)); // 7 days
    const now = Date.now();

    // Generate unique JTI (JWT ID) for token revocation support
    const jti = cryptoRandom(32);
    const accessToken = await this.jwt.signAsync(
      { sub: userId, email, jti },
      { expiresIn: accessTtl }
    );

    const plainRefresh = cryptoRandom(64);
    const tokenHash = await argon2.hash(plainRefresh);
    const expiresAt = new Date(now + refreshTtlMs);

    if (existingRefreshId) {
      await this.prisma.refreshToken.update({ where: { id: existingRefreshId }, data: { tokenHash, expiresAt, revokedAt: null } });
    } else {
      await this.prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
    }

    return { accessToken, refreshToken: plainRefresh, expiresAt, jti };
  }

  /**
   * Logout from current session by revoking the access token
   */
  async logout(userId: string, jti: string, exp: number): Promise<void> {
    // Revoke the specific access token
    await this.revocationService.revokeToken(jti, exp);

    // Optionally revoke all refresh tokens for this user
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() }
    });
  }

  /**
   * Logout from all devices by revoking all tokens for the user
   */
  async logoutAll(userId: string): Promise<void> {
    // Revoke all access tokens issued before now
    await this.revocationService.revokeAllUserTokens(userId);

    // Revoke all refresh tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() }
    });
  }
}

function cryptoRandom(len: number) {
  return randomBytes(Math.ceil(len/2)).toString('hex').slice(0,len);
}
/* legacy */
function cryptoRandomOld(len: number) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i=0;i<len;i++) out += alphabet.charAt(Math.floor(Math.random()*alphabet.length));
  return out;
}