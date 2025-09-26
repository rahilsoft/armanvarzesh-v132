import { Module } from '@nestjs/common';
import { PhysioController } from './physio.controller';
import { PhysioService } from './physio.service';
import { HealthController } from './health.controller';

@Module({
  controllers: [PhysioController, HealthController],
  providers: [PhysioService],
})
export class AppModule {}
