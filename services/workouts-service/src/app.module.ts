import { WorkoutsModule } from './workouts/workouts.module';
import { Module } from '@nestjs/common';
import { Workouts_serviceController } from './workouts-service.controller';
import { WorkoutsService as WorkoutsServiceRoot } from './workouts-service.service';
import { HealthModule } from './health/health.module';
import { EnvValidationModule } from '@arman/shared';
@Module({
  imports: [HealthModule, EnvValidationModule, WorkoutsModule],
  controllers: [Workouts_serviceController],
  providers: [WorkoutsServiceRoot],
})
export class AppModule {}