import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService, SessionContext } from './auth.service';
import { LoginDto, RegisterDto, RefreshDto } from './auth.dto';
import { JwtAuthGuard } from './jwt.guard';

function contextOf(req: Request): SessionContext {
  return {
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.auth.register(dto.email, dto.password, contextOf(req));
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.auth.login(dto.email, dto.password, contextOf(req));
  }

  // No access-token guard: the refresh token authenticates this call itself
  // (the access token is expected to be expired by the time it is used).
  @Post('refresh')
  async refresh(@Body() dto: RefreshDto, @Req() req: Request) {
    return this.auth.refresh(dto.refreshToken, contextOf(req));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request & { user: { sub: string; email: string } }) {
    return { userId: req.user.sub, email: req.user.email };
  }
}
