import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { WebPushProvider } from '../providers/webpush.provider';
import { FcmProvider } from '../providers/fcm.provider';
import { ApnsProvider } from '../providers/apns.provider';

type SendJob = { id: string; userId: string; channel: 'push'|'web'|'email'; title: string; body: string; data?: Record<string,string> };

@Processor('notifications')
@Injectable()
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private webpush: WebPushProvider, private fcm: FcmProvider, private apns: ApnsProvider) {
    super();
  }

  async process(job: Job<SendJob, any, string>): Promise<void> {
  const { id, userId, channel, title, body, data } = job.data;
  this.logger.log(`processing notification job=${job.id} channel=${channel}`);
  // fetch tokens
  const tokens = await this.prisma.deviceToken.findMany({ where: { userId, channel: channel as any } });
  let sentAny = false;
  for (const t of tokens) {
    try {
      if (channel === 'web') {
        await this.webpush.send({ title, body, data }, t.token);
      } else if (channel === 'push') {
        if (t.platform === 'ios') await this.apns.send({ title, body, data }, t.token);
        else await this.fcm.send({ title, body, data }, t.token);
      } else {
        // email not implemented
      }
      sentAny = true;
    } catch (e) {
      this.logger.error(`send failed token=${t.token}: ${e}`);
    }
  }
  await this.prisma.notificationLog.update({
    where: { id },
    data: { status: sentAny ? 'delivered' as any : 'failed' as any, deliveredAt: sentAny ? new Date() : null }
  });
}
 else if (channel === 'push') {
      // Choose platform token (ios→APNs, android→FCM). Placeholder:
      await this.fcm.send(job.data);
    } else {
      // email provider would go here
      this.logger.warn('email channel not implemented');
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<any>, err: Error) {
    this.logger.error(`job failed id=${job.id}: ${err.message}`);
  }
}
