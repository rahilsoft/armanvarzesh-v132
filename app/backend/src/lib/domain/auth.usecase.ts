import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserRepository } from '../data/repositories/user.repository';
import { AuthFailedError } from './errors';
import type { AuthResult } from './types';

/** Utility: dynamic bcrypt compare to avoid hard dep at compile time */
async function safeBcryptCompare(plain: string, hash: string): Promise<boolean> {
  try {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(plain, hash);
  } catch {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const bcrypt = require('bcrypt');
      return bcrypt.compare(plain, hash);
    } catch {
      // Last resort: never pass (forces proper install)
      return false;
    }
  }
}

@Injectable()
export class AuthUseCase {
  private readonly accessTtl = parseTtl(process.env.JWT_TTL ?? '900s'); // 15m
  private readonly refreshTtl = parseTtl(process.env.REFRESH_JWT_TTL ?? '30d');

  constructor(
    private readonly jwt: JwtService,
    private readonly users: UserRepository,
  ) {}

  /** Login with username/password → issues access & refresh tokens */
  async login(username: string, password: string): Promise<AuthResult> {
    const user = await this.users.findByUsername(username);
    if (!user) throw new AuthFailedError();

    // The repository returns a public user; we need hash, so we fetch raw record quickly (if needed)
    // For simplicity, attempt to read via public user + prisma delegate fallback:
    // @ts-ignore - unsafe but pragmatic: SafePrismaService is usually exposed globally
    const prisma = (globalThis as any).prisma || null;
    let hash = '';
    if (prisma?.user?.findUnique) {
      const u = await prisma.user.findUnique({ where: { id: user.id }, select: { password_hash: true } });
      hash = u?.password_hash || '';
    }

    const ok = hash && await safeBcryptCompare(password, hash);
    if (!ok) throw new AuthFailedError();

    const payload = { sub: user.id, u: user.username, r: user.roles };
    const accessToken = await this.jwt.signAsync(payload, { expiresIn: this.accessTtl.raw });
    const refreshToken = await this.jwt.signAsync({ ...payload, typ: 'refresh' }, { expiresIn: this.refreshTtl.raw });

    const now = Math.floor(Date.now() / 1000);
    return {
      user: { id: user.id, username: user.username, roles: user.roles },
      access: { token: accessToken, exp: now + this.accessTtl.seconds },
      refresh: { token: refreshToken, exp: now + this.refreshTtl.seconds },
    };
  }

  async refresh(oldRefreshToken: string): Promise<AuthResult> {
    const decoded: any = await this.jwt.verifyAsync(oldRefreshToken).catch(() => null);
    if (!decoded || decoded.typ !== 'refresh' || !decoded.sub) throw new AuthFailedError();
    const user = await this.users.findById(decoded.sub);
    if (!user) throw new AuthFailedError();

    const payload = { sub: user.id, u: user.username, r: user.roles };
    const accessToken = await this.jwt.signAsync(payload, { expiresIn: this.accessTtl.raw });
    const refreshToken = await this.jwt.signAsync({ ...payload, typ: 'refresh' }, { expiresIn: this.refreshTtl.raw });
    const now = Math.floor(Date.now() / 1000);
    return {
      user: { id: user.id, username: user.username, roles: user.roles },
      access: { token: accessToken, exp: now + this.accessTtl.seconds },
      refresh: { token: refreshToken, exp: now + this.refreshTtl.seconds },
    };
  }
}

function parseTtl(ttl: string) {
  const m = /^([0-9]+)\s*([smhd])?$/.exec(ttl.trim());
  if (!m) return { raw: ttl, seconds: 900 };
  const n = parseInt(m[1], 10);
  const unit = m[2] || 's';
  const mult = unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3600 : 86400;
  return { raw: `${n}${unit}`, seconds: n * mult };
}
