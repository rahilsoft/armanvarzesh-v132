import { Injectable } from '@nestjs/common';

/**
 * MonitoringService provides simple health and uptime metrics. It records
 * the time at which the service was started and exposes methods to get
 * a health check string and the elapsed time since start.
 */
@Injectable()
export class MonitoringService {
  private readonly startTime = Date.now();

  healthCheck(): string {
    return 'ok';
  }

  getUptime(): number {
    return Date.now() - this.startTime;
  }
}