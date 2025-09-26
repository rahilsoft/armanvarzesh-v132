import { Controller, Get } from '@nestjs/common';
import * as client from 'prom-client';
const register = new client.Registry();
client.collectDefaultMetrics({ register });
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller('metrics')
export class MetricsController {
  @Get()
  async metrics() { return register.metrics(); }
}