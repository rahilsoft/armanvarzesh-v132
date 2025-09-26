import { PrismaReadiness } from './prisma.readiness';
import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';
@Module({ controllers:[HealthController, CoachController], providers:[PrismaReadiness, CoachService] })
export class AppModule {}
