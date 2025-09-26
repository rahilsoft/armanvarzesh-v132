import { Controller, Get } from '@nestjs/common';

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller()
export class HealthController {
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get('/healthz')
  health() { return { ok: true }; }

  @Get('/readyz')
  ready() { return { ok: true }; }
}