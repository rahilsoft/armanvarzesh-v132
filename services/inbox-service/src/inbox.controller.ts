
import { Controller, Get, Post, Param, Query, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InboxService } from './inbox.service';

@ApiTags('inbox')
@ApiBearerAuth()
@Controller('v1')
export class InboxController {
  constructor(private readonly svc: InboxService) {}

  @Get('inbox')
  async list(@Req() req: any, @Query('limit') limit?: string, @Query('cursor') cursor?: string) {
    const uid = req.user?.id;
    if (!uid) throw new UnauthorizedException('unauthenticated');
    const userId = Number(uid);
    return this.svc.list(userId, limit ? Number(limit) : 20, cursor ? Number(cursor) : undefined);
  }

  @Post('inbox/:id/read')
  async read(@Req() req: any, @Param('id') id: string) {
    const uid = req.user?.id;
    if (!uid) throw new UnauthorizedException('unauthenticated');
    const userId = Number(uid);
    return this.svc.markRead(userId, Number(id));
  }
}
