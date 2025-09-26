
import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { ChallengesService } from './challenges.service';

const joinDto = z.object({ challengeId: z.number().int().positive() });
const completeDto = z.object({ challengeId: z.number().int().positive() });

@ApiTags('challenges')
@ApiBearerAuth()
@Controller('v1')
export class ChallengesController {
  constructor(private readonly svc: ChallengesService) {}

  @Get('challenges')
  async list() {
    return this.svc.listActive();
  }

  @Post('challenges/join')
  async join(@Body() body: any, @Req() req: any) {
    const v = joinDto.parse(body);
    const userId = Number(req.user?.id || req.headers['x-user-id'] || req.query.userId);
    return this.svc.join(v.challengeId, userId);
  }

  @Post('challenges/complete')
  async complete(@Body() body: any, @Req() req: any) {
    const v = completeDto.parse(body);
    const userId = Number(req.user?.id || req.headers['x-user-id'] || req.query.userId);
    return this.svc.complete(v.challengeId, userId);
  }
}
