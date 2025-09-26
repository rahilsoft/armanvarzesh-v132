import { Module } from '@nestjs/common';
import { MediaQueueModule } from '../mediaqueue/mediaqueue.module';
import { StorageModule } from '../storage/storage.module';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { PrismaService } from '../database/prisma.service';
import { ChatController } from './chat.controller';

/**
 * NestJS module for the chat system. Provides the ChatService and
 * ChatResolver and reuses PrismaService for database access.
 */
@Module({
  providers: [ChatResolver, ChatService, PrismaService],
  controllers: [ChatController],
})
export class ChatModule {}