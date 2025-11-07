import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshDto } from './auth.dto';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: any, @Body() dto: RefreshDto) {
    return this.auth.refresh(req.user.sub, dto.refreshToken);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return { userId: req.user.sub, email: req.user.email };
  }

  /**
   * Logout from current session - revokes the current access token
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    const { sub: userId, jti, exp } = req.user;
    await this.auth.logout(userId, jti, exp);
    return { message: 'Logged out successfully' };
  }

  /**
   * Logout from all devices - revokes all tokens for the user
   */
  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(@Req() req: any) {
    const { sub: userId } = req.user;
    await this.auth.logoutAll(userId);
    return { message: 'Logged out from all devices successfully' };
  }
}