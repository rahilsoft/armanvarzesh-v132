import { Injectable, Logger } from '@nestjs/common';
// If PrismaService exists, we use it; otherwise fallback to memory
let PrismaServiceRef: any;
try { PrismaServiceRef = require('../database/prisma.service').PrismaService; } catch {}

type MemRecord = { at: number, hash?: string };
const mem = new Map<string, MemRecord>();

@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);
  constructor(private readonly prisma?: InstanceType<typeof PrismaServiceRef>) {}

  async checkAndSet(key: string, requestHash?: string): Promise<boolean> {
    // Prefer DB if prisma available
    try {
      if (this.prisma) {
        const existing = await (this.prisma as any).idempotencyKey.findUnique({ where: { key } });
        if (existing) return false;
        await (this.prisma as any).idempotencyKey.create({ data: { key, requestHash } });
        return true;
      }
    } catch (e) {
      this.logger.warn('Idempotency via DB failed, using memory: ' + (e as Error).message);
    }
    // Memory fallback
    if (mem.has(key)) return false;
    mem.set(key, { at: Date.now(), hash: requestHash });
    return true;
  }
}
