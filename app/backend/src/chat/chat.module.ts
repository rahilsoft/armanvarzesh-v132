import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { PrismaService } from '../database/prisma.service';
import { ChatController } from './chat.controller';
import { PubSubProvider } from './pubsub.provider';
import { StorageModule } from '../storage/storage.module';
import { MediaQueueModule } from '../mediaqueue/mediaqueue.module';

/**
 * NestJS module for the chat system. Provides the ChatService and
 * ChatResolver and reuses PrismaService for database access. Provides the
 * PUB_SUB token the ChatResolver injects for GraphQL subscriptions and imports
 * StorageModule / MediaQueueModule for the services chat depends on.
 */
@Module({
  imports: [StorageModule, MediaQueueModule],
  providers: [ChatResolver, ChatService, PrismaService, PubSubProvider],
  controllers: [ChatController],
})
export class ChatModule {}