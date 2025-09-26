import { Controller, Get } from '@nestjs/common'
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller()
export class HealthController {
  @Get('healthz') health(){ return { ok:true, ts:Date.now() } }
  @Get('readyz') ready(){ return { ready:true } }
  @Get('metrics') metrics(){ return '# HELP up gauge\n# TYPE up gauge\nup 1' }
}