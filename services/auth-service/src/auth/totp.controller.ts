import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { TotpService } from './totp.service';

class VerifyDto { code: string; }

@Controller('auth/totp')
@UseGuards(JwtAuthGuard)
export class TotpController {
  constructor(private readonly totp: TotpService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('enable')
  async enable(@Req() req: any) {
    return this.totp.enable(req.user.sub);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post('verify')
  async verify(@Req() req: any, @Body() dto: VerifyDto) {
    return this.totp.verify(req.user.sub, dto.code);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('disable')
  async disable(@Req() req: any) {
    return this.totp.disable(req.user.sub);
  }
}