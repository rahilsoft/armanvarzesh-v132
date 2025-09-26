import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IdempotencyRepo } from '@arman/infra/src/idempotency';

@Injectable()
export class PrismaIdempotencyRepo implements IdempotencyRepo {
  constructor(private readonly prisma: PrismaService) {}

  async exists(key: string): Promise<boolean> {
    const rows = await this.prisma.$queryRawUnsafe<{ key: string }[]>(`SELECT key FROM idempotency_keys WHERE key = $1`, key);
    return rows.length > 0;
  }

  async save(key: string, scope?: string, meta?: unknown): Promise<void> {
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO idempotency_keys (key, scope, meta) VALUES ($1,$2,$3) ON CONFLICT (key) DO NOTHING`,
      key, scope || null, meta as any || null
    );
  }
}
