import { PrismaReadiness } from './prisma.readiness';
import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
@Module({ controllers:[HealthController, ActivitiesController], providers:[PrismaReadiness, ActivitiesService] })
export class AppModule {}
