
import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KpisService } from './kpis.service';
import { coachIdFromReq } from './auth/req-user';

@ApiTags('kpis')
@ApiBearerAuth()
@Controller('v1')
export class KpisController {
  constructor(private readonly svc: KpisService) {}

  @Get('coach/kpis')
  async kpis(@Req() req: any) {
    const coachId = coachIdFromReq(req);
    return this.svc.coachKpis(coachId);
  }
}
