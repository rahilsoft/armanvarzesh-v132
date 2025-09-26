import { PrismaReadiness } from './prisma.readiness';
import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
@Module({ controllers:[HealthController, PaymentsController], providers:[PrismaReadiness, PaymentsService] })
export class AppModule {}
