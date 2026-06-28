import { makeSmsProvider } from '../notifications/providers/sms.provider';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { KavenegarSmsService } from '../common/services/kavenegar-sms.service';

@Injectable()
export class NotificationsService {
  private provider = makeSmsProvider();

  constructor(
    private readonly prisma: PrismaService,
    private readonly sms: KavenegarSmsService,
  ) {}

  async sendSms(to: string, body: string) {
    await this.provider.send(to, body);
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
  async publishRealtime(notification: any, pubSub: any) {
    await pubSub.publish('notificationReceived', { notificationReceived: notification });
  }
}
