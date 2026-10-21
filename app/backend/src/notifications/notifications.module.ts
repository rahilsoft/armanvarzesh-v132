import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaService } from '../database/prisma.service';
import { PubSub } from 'graphql-subscriptions';
import { NotificationProcessor, NOTIFICATIONS_QUEUE } from './queue/notification.processor';
import { ExpoPushProvider } from './providers/expo-push.provider';
import { WebPushProvider } from './providers/webpush.provider';
import { EmailProvider } from './providers/email.provider';

export const PUB_SUB = 'PUB_SUB';

/**
 * Redis connection for BullMQ. REDIS_URL is required in production (no
 * localhost fallback there); development/test default to a local Redis.
 */
export function notificationsRedisConnection(env: NodeJS.ProcessEnv = process.env): { url: string } {
  const url = env.REDIS_URL;
  if (url) return { url };
  if (env.NODE_ENV === 'production') {
    throw new Error('REDIS_URL is required in production for the notifications queue');
  }
  return { url: 'redis://localhost:6379' };
}

/*
 * NotificationsResolver is intentionally not registered: its operations take
 * a client-supplied userId and have no auth guard. Re-enable only after it is
 * scoped to the JWT principal.
 */
@Module({
  imports: [
    BullModule.forRootAsync({ useFactory: () => ({ connection: notificationsRedisConnection() }) }),
    BullModule.registerQueue({ name: NOTIFICATIONS_QUEUE }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationProcessor,
    ExpoPushProvider,
    WebPushProvider,
    EmailProvider,
    PrismaService,
    { provide: PUB_SUB, useValue: new PubSub() },
  ],
  exports: [NotificationsService, PUB_SUB],
})
export class NotificationsModule {}
