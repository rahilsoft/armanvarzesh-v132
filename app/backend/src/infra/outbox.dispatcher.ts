import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaOutboxRepo } from './outbox.prisma.repo';
import { MediaService } from '../media/media.service';

@Injectable()
export class OutboxDispatcher {
  private readonly logger = new Logger(OutboxDispatcher.name);
  constructor(private outboxRepo: PrismaOutboxRepo, private media: MediaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async tick() {
    const batch = await this.outboxRepo.fetchUnpublished(100);
    for (const item of batch) {
      const { id, event } = item;
      try {
        if (event.aggregate === 'media' && event.type === 'MediaUploaded') {
          const kind = (event.payload as any)?.kind === 'video' ? 'video' : 'image';
          await this.media.enqueueTranscode((event.payload as any).key, kind as any);
        }
        await this.outboxRepo.markPublished(id);
      } catch (e) {
        this.logger.error(`dispatch failed for outbox id=${id}`, e as Error);
        await this.outboxRepo.incrementRetry(id);
      }
    }
  }
}
