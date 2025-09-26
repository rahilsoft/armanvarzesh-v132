import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringResolver } from './monitoring.resolver';

@Module({
  providers: [MonitoringService, MonitoringResolver],
})
export class MonitoringModule {}