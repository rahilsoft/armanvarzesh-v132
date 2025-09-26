import { Injectable, Logger } from '@nestjs/common';
// NOTE: Wire this to your Prisma/DB service when available.
@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);
  async record(event: string, payload: unknown) {
    try {
      // NOTE: implement durable persistence (DB/outbox/retention) inject PrismaService and persist in audit_logs table
      this.logger.log(`AUDIT ${event}: ${JSON.stringify(payload)}`);
      return true;
    } catch (e) {
      this.logger.error('Failed to record audit log', e as Error);
      return false;
    }
  }
}
