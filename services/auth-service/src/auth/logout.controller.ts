import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { TokenBlacklistService } from './token-blacklist.service';
import { JwtGuard } from './jwt.guard';

@Controller('auth')
export class LogoutController {
  constructor(private readonly blacklist: TokenBlacklistService) {}

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@Req() req: any) {
    const user = req.user;
    const jti = user?.jti;

    if (!jti) {
      return { ok: false, error: 'No jti in token' };
    }

    // Blacklist token with TTL matching JWT expiry
    const ttl = user.exp ? user.exp - Math.floor(Date.now() / 1000) : 900;
    await this.blacklist.blacklist(jti, Math.max(ttl, 60));

    return { ok: true, message: 'Logged out successfully' };
  }
}
