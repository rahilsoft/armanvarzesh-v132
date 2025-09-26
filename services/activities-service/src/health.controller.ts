import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import * as client from 'prom-client';
import { PrismaReadiness } from './prisma.readiness';

// /metrics: default metrics + service_up
const register = new client.Registry();
client.collectDefaultMetrics({ register });
const up = new client.Gauge({ name: 'service_up', help: '1 if service booted' });
up.set(1); register.registerMetric(up);

@Controller()
export class HealthController {
  constructor(private health: HealthCheckService, private prismaReady: PrismaReadiness){}

  @Get('/health')
  @HealthCheck()
  healthz() {
    return this.health.check([ async () => ({ service: { status: 'up' } }) ]);
  }

  @Get('/ready')
  @HealthCheck()
  async ready() {
    const ok = await this.prismaReady.ping();
    if (!ok) throw new ServiceUnavailableException('DB_NOT_READY');
    return { status: 'ready' };
  }

  @Get('/metrics')
  async metrics() {
    return register.metrics();
  }
}
