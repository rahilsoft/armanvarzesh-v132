
import { Module } from '@nestjs/common';
import { FunnelResolver } from './funnel.resolver';

@Module({
  providers:[FunnelResolver]
})
export class AnalyticsModule {}
