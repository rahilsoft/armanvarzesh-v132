import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { IsString, MinLength } from 'class-validator';

type AdminRole = 'owner' | 'coach' | 'support';
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
  @Throttle(5, 60)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: AdminLoginDto) {
    const secret = process.env.ADMIN_JWT_SECRET;
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

    const token = jwt.sign({ sub: user.u, role: user.r }, secret, { expiresIn: process.env.ADMIN_JWT_TTL || '12h' });
    return { token, role: user.r };
  }
}