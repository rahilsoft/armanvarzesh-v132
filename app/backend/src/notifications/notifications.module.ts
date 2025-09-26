import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { PrismaService } from '../database/prisma.service';
import { PubSub } from 'graphql-subscriptions';

export const PUB_SUB = 'PUB_SUB';

@Module({
  providers: [
    NotificationsService,
    NotificationsResolver,
    PrismaService,
    { provide: PUB_SUB, useValue: new PubSub() },
  ],
  exports: [NotificationsService, PUB_SUB]
})
export class NotificationsModule {}
