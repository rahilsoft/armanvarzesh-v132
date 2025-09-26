import { Controller, Get } from '@nestjs/common';
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller('health')
export class HealthController {
  @Get()
  liveness() { return { status: 'ok', ts: Date.now() }; }
}