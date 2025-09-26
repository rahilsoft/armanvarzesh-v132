import { PrismaReadiness } from './prisma.readiness';
import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
@Module({ controllers:[HealthController, NotificationsController], providers:[PrismaReadiness, NotificationsService] })
export class AppModule {}
