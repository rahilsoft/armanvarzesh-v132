import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { MetricsGuard } from './metrics.guard';
import { MetricsService } from './metrics.service';

@Controller()
export class MetricsController {
  constructor(private readonly metrics: MetricsService){}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @UseGuards(MetricsGuard)
  @Get('/metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4')
  async metricsEndpoint(){ return this.metrics.getMetrics(); }
}