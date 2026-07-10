
import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';
import { userIdFromReq } from './auth/req-user';

@ApiTags('affiliate')
@ApiBearerAuth()
@Controller('v1/affiliate')
export class AffiliateController {
  constructor(private readonly svc: AffiliateService) {}

  @Get('me')
  async me(@Req() req: any) {
    const userId = userIdFromReq(req);
    return this.svc.me(userId);
  }

  @Get('leaderboard')
  async leaderboard() {
    return this.svc.leaderboard();
  }
}
