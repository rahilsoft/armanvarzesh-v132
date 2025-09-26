import { Injectable } from '@nestjs/common';

/** SecurityService
 *  In-memory audit log for development; replace with persistent storage for production.
 */
export interface AuditEntry {
  userId: number;
  action: string;
  meta?: Record<string, unknown>;
  timestamp: Date;
}

@Injectable()
export class SecurityService {
  auditLog: AuditEntry[] = [];

  logAction(userId: number, action: string, meta?: Record<string, unknown>): void {
    this.auditLog.push({ userId, action, meta, timestamp: new Date() });
  }
}