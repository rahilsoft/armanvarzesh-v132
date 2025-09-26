import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { OutboxRepo, OutboxEvent } from '@arman/infra/src/outbox';

type Row = { id: string; aggregate: string; aggregate_id: string; type: string; payload: any; created_at: Date; };

@Injectable()
export class PrismaOutboxRepo implements OutboxRepo {
  constructor(private readonly prisma: PrismaService) {}

  async insert(e: OutboxEvent): Promise<void> {
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO outbox_events (aggregate, aggregate_id, type, payload) VALUES ($1,$2,$3,$4)`,
      e.aggregate, e.aggregateId, e.type, e.payload as any
    );
  }

  async fetchUnpublished(limit: number) {
    const rows = await this.prisma.$queryRawUnsafe<Row[]>(
      `SELECT id, aggregate, aggregate_id, type, payload, created_at FROM outbox_events WHERE published_at IS NULL ORDER BY created_at ASC LIMIT $1`,
      limit
    );
    return rows.map(r => ({ id: String(r.id), event: { aggregate: r.aggregate, aggregateId: r.aggregate_id, type: r.type, payload: r.payload } }));
  }

  async markPublished(id: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(
      `UPDATE outbox_events SET published_at = now() WHERE id = $1 AND published_at IS NULL`,
      id
    );
  }

  async incrementRetry(id: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(`UPDATE outbox_events SET retry_count = retry_count + 1 WHERE id = $1`, id);
  }
}
