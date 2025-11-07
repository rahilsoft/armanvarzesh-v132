import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Chat Persistence Service
 * Stores messages in PostgreSQL for history and search
 */
@Injectable()
export class ChatPersistenceService {
  private prisma = new PrismaClient();

  async saveMessage(data: {
    threadId: string;
    senderId: string;
    senderRole: string;
    body?: string;
    voiceUrl?: string;
  }) {
    return this.prisma.chatMessage.create({
      data: {
        threadId: data.threadId,
        senderId: data.senderId,
        senderRole: data.senderRole,
        body: data.body,
        voiceUrl: data.voiceUrl,
      },
    });
  }

  async getHistory(threadId: string, limit = 50, cursor?: string) {
    return this.prisma.chatMessage.findMany({
      where: { threadId, ...(cursor ? { id: { lt: cursor } } : {}) },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
