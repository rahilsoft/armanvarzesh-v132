
import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [AnalyticsService, AnalyticsResolver, PrismaService],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}
