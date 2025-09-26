import { WorkoutsModule } from './workouts/workouts.module';
import { Module } from '@nestjs/common';
import { WorkoutsServiceController } from './workouts-service.controller';
import { WorkoutsServiceService } from './workouts-service.service';
import { HealthModule } from './health/health.module';
import { EnvValidationModule } from '@arman/shared';
@Module({
  imports: [HealthModule, EnvValidationModule, WorkoutsModule],
  controllers: [WorkoutsServiceController],
  providers: [WorkoutsServiceService],
})
export class AppModule {}