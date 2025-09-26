import { Resolver, Query, Int } from '@nestjs/graphql';
import { MonitoringService } from './monitoring.service';

@Resolver()
export class MonitoringResolver {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Query(() => String)
  health() {
    return this.monitoringService.healthCheck();
  }

  @Query(() => Int)
  uptime() {
    return this.monitoringService.getUptime();
  }
}