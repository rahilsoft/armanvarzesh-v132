import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import * as client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register });
const up = new client.Gauge({ name: 'service_up', help: '1 if service booted' });
up.set(1); register.registerMetric(up);

@Controller()
export class HealthController {
  constructor(private health: HealthCheckService){}

  @Get('/health')
  @HealthCheck()
  healthz(){ return this.health.check([ async ()=> ({ gateway: { status: 'up' }}) ]); }

  @Get('/ready')
  @HealthCheck()
  ready(){ return this.health.check([ async ()=> ({ gateway: { status: 'ready' }}) ]); }

  @Get('/metrics')
  async metrics(){ return register.metrics(); }
}
