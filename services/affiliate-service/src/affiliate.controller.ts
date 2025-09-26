
import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';

@ApiTags('affiliate')
@ApiBearerAuth()
@Controller('v1/affiliate')
export class AffiliateController {
  constructor(private readonly svc: AffiliateService) {}

  @Get('me')
  async me(@Req() req: any) {
    const userId = Number(req.user?.id || req.headers['x-user-id'] || 1);
    return this.svc.me(userId);
  }

  @Get('leaderboard')
  async leaderboard() {
    return this.svc.leaderboard();
  }
}
