import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PostgresHealthIndicator, RedisHealthIndicator, RabbitMQHealthIndicator, MinioHealthIndicator } from '@arman/shared';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PostgresHealthIndicator, RedisHealthIndicator, RabbitMQHealthIndicator, MinioHealthIndicator],
})
export class HealthModule {}