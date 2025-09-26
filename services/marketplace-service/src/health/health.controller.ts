import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PostgresHealthIndicator, RedisHealthIndicator, RabbitMQHealthIndicator, MinioHealthIndicator } from '@arman/shared';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private pg: PostgresHealthIndicator,
    private redis: RedisHealthIndicator,
    private rmq: RabbitMQHealthIndicator,
    private minio: MinioHealthIndicator,
  ) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  @HealthCheck()
  check() {
    const db = process.env.DATABASE_URL || '';
    const redis = process.env.REDIS_URL || '';
    const rmq = process.env.RABBITMQ_URL || '';
    const minioEndpoint = process.env.MINIO_ENDPOINT || 'minio';
    const minioPort = Number(process.env.MINIO_PORT || 9000);
    const minioAccess = process.env.MINIO_ACCESS_KEY || '';
    const minioSecret = process.env.MINIO_SECRET_KEY || '';
    return this.health.check([
      () => this.pg.isHealthy('postgres', db),
      () => this.redis.isHealthy('redis', redis),
      () => this.rmq.isHealthy('rabbitmq', rmq),
      () => this.minio.isHealthy('minio', minioEndpoint, minioAccess, minioSecret, minioPort),
    ]);
  }
}