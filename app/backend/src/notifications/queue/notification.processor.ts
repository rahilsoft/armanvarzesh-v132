import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { WebPushProvider } from '../providers/webpush.provider';
import { ExpoPushProvider } from '../providers/expo-push.provider';
import { EmailProvider } from '../providers/email.provider';

export const NOTIFICATIONS_QUEUE = 'notifications';

export type NotificationChannel = 'push' | 'web' | 'email';

/** Job payload. `id` is the NotificationLog row created when the job was enqueued. */
export type SendJob = {
  id: string;
  userId: number;
  channel: NotificationChannel;
  title: string;
  body: string;
  data?: Record<string, string>;
};

/** DeviceToken.provider value used for each token-based channel. */
const TOKEN_PROVIDER: Record<'push' | 'web', string> = { push: 'expo', web: 'webpush' };

@Processor(NOTIFICATIONS_QUEUE)
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

  async process(job: Job<SendJob, unknown, string>): Promise<void> {
    const { id, userId, channel, title, body, data } = job.data;
    this.logger.log(`processing notification job=${job.id} channel=${channel}`);

    let delivered = 0;
    const failures: string[] = [];

    if (channel === 'email') {
      // Email has no device tokens: a provider must accept it for delivery.
      try {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
        if (!user?.email) throw new Error('NoEmailAddress');
        await this.email.send(user.email, title, body);
        delivered++;
      } catch (e) {
        failures.push((e as Error).message);
      }
    } else {
      const tokens = await this.prisma.deviceToken.findMany({
        where: { userId, provider: TOKEN_PROVIDER[channel] },
        select: { token: true },
      });
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
            await this.prisma.deviceToken.deleteMany({ where: { userId, token: { in: dead } } });
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
    const reason = [...new Set(failures)].join(', ');
    if (!ok) this.logger.error(`notification job=${job.id} failed: ${reason}`);
    await this.prisma.notificationLog.update({
      where: { id },
      data: {
        status: ok ? 'delivered' : 'failed',
        deliveredAt: ok ? new Date() : null,
        failureReason: ok ? null : reason.slice(0, 500),
      },
    });
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<unknown>, err: Error) {
    this.logger.error(`job failed id=${job.id}: ${err.message}`);
  }
}
