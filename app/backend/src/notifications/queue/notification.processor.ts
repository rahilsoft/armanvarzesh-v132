import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { WebPushProvider } from '../providers/webpush.provider';
import { ExpoPushProvider } from '../providers/expo-push.provider';
import { EmailProvider } from '../providers/email.provider';

type SendJob = { id: string; userId: string; channel: 'push' | 'web' | 'email'; title: string; body: string; data?: Record<string, string> };

@Processor('notifications')
@Injectable()
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private webpush: WebPushProvider,
    private expo: ExpoPushProvider,
    private email: EmailProvider,
  ) {
    super();
  }

  async process(job: Job<SendJob, any, string>): Promise<void> {
    const { id, userId, channel, title, body, data } = job.data;
    this.logger.log(`processing notification job=${job.id} channel=${channel}`);
    const db = this.prisma as any;

    let delivered = 0;
    const failures: string[] = [];

    if (channel === 'email') {
      // Email has no device tokens: a provider must accept it for delivery.
      try {
        await this.email.send(userId, title, body);
        delivered++;
      } catch (e) {
        failures.push((e as Error).message);
      }
    } else {
      const tokens: Array<{ token: string }> = await db.deviceToken.findMany({ where: { userId, channel: channel as any } });
      if (tokens.length === 0) failures.push('NoDeviceTokens');
      else if (channel === 'push') {
        const results = await this.expo.sendMany({ title, body, data }, tokens.map((t) => t.token));
        const dead: string[] = [];
        for (const r of results) {
          if (r.ok) delivered++;
          else {
            failures.push(r.error ?? 'unknown');
            if (r.invalidToken) dead.push(r.token);
          }
        }
        if (dead.length) {
          try {
            await db.deviceToken.deleteMany({ where: { token: { in: dead } } });
          } catch (e) {
            this.logger.warn(`could not prune invalid device tokens: ${(e as Error).message}`);
          }
        }
      } else {
        for (const t of tokens) {
          try {
            await this.webpush.send({ title, body, data }, t.token);
            delivered++;
          } catch (e) {
            failures.push((e as Error).message);
          }
        }
      }
    }

    const ok = delivered > 0;
    if (!ok) this.logger.error(`notification job=${job.id} failed: ${[...new Set(failures)].join(', ')}`);
    await db.notificationLog.update({
      where: { id },
      data: {
        status: ok ? 'delivered' : 'failed',
        deliveredAt: ok ? new Date() : null,
        failureReason: ok ? null : [...new Set(failures)].join(', ').slice(0, 500),
      },
    });
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<any>, err: Error) {
    this.logger.error(`job failed id=${job.id}: ${err.message}`);
  }
}
