/**
AuthService
Provides environment-driven admin authentication (username/password) and issues JSON Web Tokens.
@remarks
- Uses `ADMIN_USERS_JSON` to bootstrap admin users (with bcrypt password hashes).
- Issues access & refresh tokens with TTL from env variables.
@public
*/
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload, Tokens } from './auth.types';
import { requireEnv } from '../common/utils/nulls';

type AdminRole = 'owner' | 'coach' | 'support';
type AdminUser = { u: string; p?: string; h?: string; r: AdminRole };

/** Lightweight AuthService using ADMIN_USERS_JSON (fallback), without persistence for refresh. */
@Injectable()
export class AuthService {
  private signAccess(payload: JwtPayload): string {
    const secret = requireEnv('JWT_SECRET');
    const ttl = process.env.JWT_TTL || '7d';
    return jwt.sign(payload, secret, { expiresIn: ttl });
  }

  private signRefresh(payload: JwtPayload): string {
    const secret = process.env.REFRESH_JWT_SECRET || requireEnv('JWT_SECRET');
    const ttl = process.env.REFRESH_JWT_TTL || '30d';
    return jwt.sign(payload, secret, { expiresIn: ttl });
  }

  async login(body: LoginDto): Promise<Tokens> {
    const usersRaw = process.env.ADMIN_USERS_JSON || '[]';
    let users: AdminUser[] = [];
    try { users = JSON.parse(usersRaw); } catch { users = []; }

    const found = users.find(x => x.u === body.username);
    if (!found) throw new UnauthorizedException('invalid credentials');

    let ok = false;
    if (found.h) ok = bcrypt.compareSync(body.password, found.h);
    else if (found.p) ok = body.password.length === found.p.length && crypto.timingSafeEqual(Buffer.from(body.password), Buffer.from(found.p));

    if (!ok) throw new UnauthorizedException('invalid credentials');

    const jti = crypto.randomUUID();
    const payload: JwtPayload = { sub: found.u, role: found.r, jti };
    const accessToken = this.signAccess(payload);
    const refreshToken = this.signRefresh({ sub: found.u, role: found.r, jti });
    const decoded: any = jwt.decode(accessToken);
    const exp = Number(decoded?.exp || 0);
    const now = Math.floor(Date.now()/1000);
    const expiresIn = Math.max(0, exp - now);
    return { accessToken, refreshToken, expiresIn };
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    try {
      const secret = process.env.REFRESH_JWT_SECRET || requireEnv('JWT_SECRET');
      const decoded = jwt.verify(refreshToken, secret) as JwtPayload;
      const jti = crypto.randomUUID();
      const accessToken = this.signAccess({ sub: decoded.sub, role: decoded.role, jti });
      const newRefresh = this.signRefresh({ sub: decoded.sub, role: decoded.role, jti });
      const exp: any = jwt.decode(accessToken);
      const expNum = Number((exp as any)?.exp || 0);
      const now = Math.floor(Date.now()/1000);
      const expiresIn = Math.max(0, expNum - now);
      return { accessToken, refreshToken: newRefresh, expiresIn };
    } catch {
      throw new UnauthorizedException('invalid refresh token');
    }
  }
}
