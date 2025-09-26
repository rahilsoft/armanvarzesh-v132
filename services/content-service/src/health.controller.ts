
import { Controller, Get } from '@nestjs/common';

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller()
export class HealthController {
  @Get('/healthz') health(){ return { ok: true }; }
  @Get('/ready') ready(){ return { ready: true }; }
}