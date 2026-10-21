import { makeSmsProvider } from '../notifications/providers/sms.provider';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { PrismaService } from '../database/prisma.service';
import { isExpoPushToken } from './providers/expo-push.provider';
import { NOTIFICATIONS_QUEUE, NotificationChannel, SendJob } from './queue/notification.processor';

export type DevicePlatform = 'ios' | 'android' | 'web';
export const DEVICE_PLATFORMS: readonly DevicePlatform[] = ['ios', 'android', 'web'];

export interface SendNotificationInput {
  userId: number;
  channel: NotificationChannel;
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private provider = makeSmsProvider();

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(NOTIFICATIONS_QUEUE) private readonly queue: Queue<SendJob>,
  ) {}

  async sendSms(to: string, body: string) {
    await this.provider.send(to, body);
  }

  async sendOtp(to: string, code: string) {
    if (this.provider.sendOtp) await this.provider.sendOtp(to, code);
    else await this.provider.send(to, code);
  }

  /**
   * Create and persist a notification for a user. The `isCritical` flag is
   * accepted for API compatibility but is not currently persisted.
   */
  async create(userId: number, text: string, _isCritical = false) {
    return this.prisma.notification.create({ data: { userId, text } });
  }

  async findAllByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: number) {
    await this.prisma.notification.update({ where: { id }, data: { read: true } });
    return true;
  }

  async markRead(id: number) {
    return this.prisma.notification.update({ where: { id }, data: { read: true } });
  }

  async markAllRead(userId: number) {
    const res = await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return res.count > 0;
  }

  async delete(id: number) {
    await this.prisma.notification.delete({ where: { id } });
    return true;
  }

  /**
   * PubSub publishing hook — call after creating a notification to push it to
   * any subscribed clients in real time.
   */
  async publishRealtime(notification: unknown, pubSub: { publish(t: string, p: unknown): Promise<void> }) {
    await pubSub.publish('notificationReceived', { notificationReceived: notification });
  }

  /**
   * Register (or refresh) an Expo push token for the authenticated user.
   * `userId` must come from the verified JWT. A token re-registered by another
   * user moves to that user (device changed hands). Errors propagate.
   */
  async registerToken(userId: number, token: string, platform: DevicePlatform) {
    if (!Number.isInteger(userId) || userId <= 0) throw new BadRequestException('invalid user');
    if (typeof token !== 'string' || !isExpoPushToken(token)) {
      throw new BadRequestException('invalid Expo push token');
    }
    if (!DEVICE_PLATFORMS.includes(platform)) throw new BadRequestException('invalid platform');
    const now = new Date();
    const row = await this.prisma.deviceToken.upsert({
      where: { token },
      create: { userId, token, platform, provider: 'expo' },
      update: { userId, platform, provider: 'expo', lastSeenAt: now },
      select: { id: true, platform: true, createdAt: true, lastSeenAt: true },
    });
    return row;
  }

  /** Remove a push token, only when it belongs to the authenticated user. */
  async unregisterToken(userId: number, token: string) {
    const res = await this.prisma.deviceToken.deleteMany({ where: { userId, token } });
    return { removed: res.count };
  }

  /**
   * Enqueue an outbound notification. Writes a NotificationLog row (queued)
   * and adds a BullMQ job keyed by the log id; NotificationProcessor delivers
   * it and records delivered/failed on the same row.
   */
  async send(input: SendNotificationInput): Promise<{ id: string; status: 'queued' }> {
    const log = await this.prisma.notificationLog.create({
      data: { userId: input.userId, channel: input.channel, title: input.title.slice(0, 200), status: 'queued' },
      select: { id: true },
    });
    const job: SendJob = { id: log.id, ...input };
    try {
      await this.queue.add('send', job, {
        jobId: log.id,
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 1000,
        removeOnFail: 5000,
      });
    } catch (e) {
      const reason = `EnqueueFailed: ${(e as Error).message}`.slice(0, 500);
      this.logger.error(`notification enqueue failed log=${log.id}: ${(e as Error).message}`);
      await this.prisma.notificationLog.update({ where: { id: log.id }, data: { status: 'failed', failureReason: reason } });
      throw e;
    }
    return { id: log.id, status: 'queued' };
  }
}
