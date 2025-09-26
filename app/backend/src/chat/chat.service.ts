import { MediaQueueService } from '../mediaqueue/mediaqueue.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Message as MessageModel } from '@prisma/client';

/**
 * Service encapsulating chat message persistence and retrieval. Messages are
 * stored using Prisma's Message model and can be queried by conversation or
 * inbox. All timestamps are generated at the time of creation.
 */
@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persist a new message from `senderId` to `receiverId` with the given
   * `content`. Returns the stored message record.
   */
  async sendMessage(senderId: number, receiverId: number, content: string): Promise<MessageModel> {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        createdAt: new Date()
      }
    });
  }

  /**
   * Retrieve the complete conversation between two users ordered by
   * creation time ascending. This includes messages sent in both directions.
   */
  async getConversation(userId1: number, userId2: number): Promise<MessageModel[]> {
    return this.prisma.message.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20, 
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  /**
   * Retrieve the inbox for a user, i.e. all messages where they are the
   * receiver. Messages are returned in descending order of creation time.
   */
  async getInbox(userId: number): Promise<MessageModel[]> {
    return this.prisma.message.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20, 
      where: { receiverId: userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
async sendAttachmentMessage(senderId: number, receiverId: number, key: string, contentType: string) {
  const att = await this.prisma.attachment.create({ data: { key, contentType } });
    // If video, enqueue thumbnail job (webp 480w)
    if (contentType.startsWith('video')) {
      const outputKey = `${key}.thumb.webp`;
      await this.media.enqueueImage(await this.presigned(key), outputKey, 'webp', 480);
      try { await this.prisma.attachment.update({ where: { id: att.id }, data: { thumbKey: outputKey } }); } catch {}
    }
  const msg = await (this.prisma as any).message.create({
    data: {
      senderId, receiverId, content: '', attachmentId: att.id, createdAt: new Date()
    }
  });
  return msg;
}


private async presigned(key: string): Promise<string> {
  const { StorageService } = await import('../storage/storage.service');
  const storage = new StorageService();
  const d = await storage.createDownloadUrl(key);
  return d.downloadUrl;
}
