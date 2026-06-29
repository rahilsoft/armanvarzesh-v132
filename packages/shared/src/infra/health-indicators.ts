import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

/**
 * Lightweight health indicators shared by every microservice's HealthModule.
 *
 * These provide baseline liveness signals based on whether the relevant
 * connection string / endpoint is configured. Each service can later swap in a
 * real connectivity probe; the public `isHealthy(...)` surface stays the same.
 */

@Injectable()
export class PostgresHealthIndicator extends HealthIndicator {
  async isHealthy(key: string, url?: string): Promise<HealthIndicatorResult> {
    return this.getStatus(key, !!url, { configured: !!url });
  }
}

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  async isHealthy(key: string, url?: string): Promise<HealthIndicatorResult> {
    return this.getStatus(key, !!url, { configured: !!url });
  }
}

@Injectable()
export class RabbitMQHealthIndicator extends HealthIndicator {
  async isHealthy(key: string, url?: string): Promise<HealthIndicatorResult> {
    return this.getStatus(key, !!url, { configured: !!url });
  }
}

@Injectable()
export class MinioHealthIndicator extends HealthIndicator {
  async isHealthy(
    key: string,
    endpoint?: string,
    accessKey?: string,
    secretKey?: string,
    port?: number,
  ): Promise<HealthIndicatorResult> {
    const configured = !!endpoint && !!accessKey && !!secretKey;
    return this.getStatus(key, configured, { configured, endpoint, port });
  }
}
