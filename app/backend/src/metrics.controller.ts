import { Controller, Get } from '@nestjs/common';
import * as client from 'prom-client';

const register = new client.Registry();
register.setDefaultLabels({ app: 'backend' });
client.collectDefaultMetrics({ register });

@Controller()
export class MetricsController {
  @Get('/metrics')
  async metrics(): Promise<string> {
    return await register.metrics();
  }
}
