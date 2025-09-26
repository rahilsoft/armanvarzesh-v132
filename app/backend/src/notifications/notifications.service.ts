import { makeSmsProvider } from '../notifications/providers/sms.provider';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { KavenegarSmsService } from '../common/services/kavenegar-sms.service';

@Injectable()
export class NotificationsService {
  private provider = makeSmsProvider();
  constructor(private readonly prisma: PrismaService, private readonly sms: KavenegarSmsService) {}

  async sendSms(to: string, body: string) { await this.provider.send(to, body); }
}


// PubSub publishing hook — call after creating a notification
async publishRealtime(notification: any, pubSub: any) {
  await pubSub.publish('notificationReceived', { notificationReceived: notification });
}


async markRead(id: number) {
  // Baseline: replace with Prisma update
  return { id, read: true };
}

async markAllRead(userId: number) {
  // Baseline: replace with Prisma updateMany
  return true;
}


async createForUser(userId: number, text: string) {
  const n = await this.prisma.notification.create({ data: { userId, text } });
  return n;
}

async listForUser(userId: number) {
  return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}

async markRead(id: number) {
  return this.prisma.notification.update({ where: { id }, data: { read: true } });
}

async markAllRead(userId: number) {
  const res = await this.prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  return res.count > 0;
}
