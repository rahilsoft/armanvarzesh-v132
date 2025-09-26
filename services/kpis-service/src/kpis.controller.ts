
import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KpisService } from './kpis.service';

@ApiTags('kpis')
@ApiBearerAuth()
@Controller('v1')
export class KpisController {
  constructor(private readonly svc: KpisService) {}

  @Get('coach/kpis')
  async kpis(@Req() req: any) {
    const coachId = Number(req.user?.id || req.headers['x-coach-id'] || 1);
    return this.svc.coachKpis(coachId);
  }
}
