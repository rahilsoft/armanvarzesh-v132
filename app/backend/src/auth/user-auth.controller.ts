import { Body, Controller, HttpCode, HttpStatus, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { UserAuthService, SessionContext } from './user-auth.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { RefreshDto } from './dto/refresh.dto';

function contextOf(req: Request): SessionContext {
  return {
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  };
}

/**
 * Canonical first-party user authentication (`/auth`). Backed by
 * {@link UserAuthService} (argon2 + selector/verifier refresh rotation).
 * Admin authentication lives separately at `/admin/login`.
 */
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class UserAuthController {
  constructor(private readonly auth: UserAuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: UserRegisterDto, @Req() req: Request) {
    return this.auth.register(dto.email, dto.password, dto.name, contextOf(req));
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: UserLoginDto, @Req() req: Request) {
    return this.auth.login(dto.email, dto.password, contextOf(req));
  }

  // No access-token guard: the refresh token authenticates this call itself
  // (the access token is expected to be expired by the time it is used).
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshDto, @Req() req: Request) {
    return this.auth.refresh(dto.refreshToken, contextOf(req));
  }
}
