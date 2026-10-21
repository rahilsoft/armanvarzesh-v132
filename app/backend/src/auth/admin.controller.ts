import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { IsString, MinLength } from 'class-validator';
import { AdminGuard } from './admin.guard';
import { optionalJwtSecret } from '../config/jwt-secrets';

type AdminRole = 'owner' | 'coach' | 'support';
const ADMIN_ROLES: AdminRole[] = ['owner', 'coach', 'support'];
type AdminUser = { u: string; p?: string; h?: string; r: AdminRole };

class AdminLoginDto {
  @IsString() @MinLength(3) username!: string;
  @IsString() @MinLength(6) password!: string;
}

function safeFindUser(users: AdminUser[], username: string): AdminUser | undefined {
  return users.find((x) => x.u === username);
}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller('admin')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AdminController {
  /**
   * Identity of the calling admin, from the verified admin JWT only. There is
   * no role column on the Admin table (admins are defined by ADMIN_USERS_JSON),
   * so the role comes from the verified token claims. The static
   * ADMIN_API_TOKEN carries no identity and is rejected here.
   */
  @UseGuards(AdminGuard)
  @Get('me')
  me(@Req() req: { user?: { sub?: unknown; role?: unknown } }) {
    const sub = req.user?.sub;
    const role = req.user?.role;
    if (typeof sub !== 'string' || !sub || typeof role !== 'string' || !ADMIN_ROLES.includes(role as AdminRole)) {
      throw new UnauthorizedException('admin identity required');
    }
    return { id: sub, role: role as AdminRole, ...(sub.includes('@') ? { email: sub } : {}) };
  }

  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: AdminLoginDto) {
    const secret = optionalJwtSecret('ADMIN_JWT_SECRET');
    const usersRaw = process.env.ADMIN_USERS_JSON || '[]';
    if (!secret) throw new UnauthorizedException('admin jwt not configured');

    let users: AdminUser[] = [];
    try { users = JSON.parse(usersRaw); } catch { users = []; }

    const user = safeFindUser(users, body.username);
    if (!user) throw new UnauthorizedException('invalid credentials');

    let ok = false;
    if (user.h) ok = bcrypt.compareSync(body.password, user.h);
    else if (user.p) ok = body.password.length === user.p.length && crypto.timingSafeEqual(Buffer.from(body.password), Buffer.from(user.p));

    if (!ok) throw new UnauthorizedException('invalid credentials');

    const token = jwt.sign({ sub: user.u, role: user.r }, secret, { algorithm: 'HS256', expiresIn: process.env.ADMIN_JWT_TTL || '12h' });
    return { token, role: user.r };
  }
}