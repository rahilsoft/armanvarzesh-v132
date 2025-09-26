import { StorageService } from '../storage/storage.service';
import { Inject } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LoaderFactory } from '@arman/graphql-dataloader';
import { PubSub } from 'graphql-subscriptions';
import { Resolver, Query, Mutation, Args, Int, Subscription, ResolveField, Parent } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';
import { SendMessageInput, SendAttachmentInput } from './dto/message.input';

/**
 * GraphQL resolver exposing chat operations. Supports sending messages
 * and retrieving conversations and inboxes for users. Future improvements
 * could include subscriptions for real-time updates.
 */
@Resolver(() => Message)
import { PUB_SUB } from '../notifications/notifications.module';
export class ChatResolver {
  constructor(private prisma: PrismaService, private loaderFactory: LoaderFactory) {}

  constructor(private readonly chatService: ChatService, @Inject(PUB_SUB) private pubSub: PubSub, private readonly storage: StorageService) {}

  /**
   * Send a new message from one user to another. Returns the persisted
   * message entity.
   */
  @Mutation(() => Message)
  async sendMessage(@Args('input') input: SendMessageInput) {
    return this.chatService.sendMessage(input.senderId, input.receiverId, input.content);
  }

  /**
   * Retrieve the full conversation between two users ordered by timestamp.
   */
  @Query(() => [Message])
  async conversation(
    @Args('userId1', { type: () => Int }) userId1: number,
    @Args('userId2', { type: () => Int }) userId2: number
  ) {
    return this.chatService.getConversation(userId1, userId2);
  }

  /**
   * Retrieve the inbox for a single user. Messages are ordered from newest to oldest.
   */
  @Query(() => [Message])
  async inbox(@Args('userId', { type: () => Int }) userId: number) {
    return this.chatService.getInbox(userId);
  }
}
@Mutation(() => Message)
async sendAttachment(@Args('input') input: SendAttachmentInput) {
  const msg = await this.chatService.sendAttachmentMessage(input.senderId, input.receiverId, input.key, input.contentType);
  try { await this.pubSub.publish('messageReceived', { messageReceived: msg }); } catch {}
  return msg;
}

@Subscription(() => Message, {
  filter: (payload, vars) => payload.messageReceived.receiverId === vars.userId || payload.messageReceived.senderId === vars.userId
})
messageReceived(@Args('userId', { type: () => Int }) userId: number) {
  return this.pubSub.asyncIterator('messageReceived');
}


@ResolveField('attachmentUrl', () => String, { nullable: true })
async attachmentUrl(parent: any) {
    if (!parent?.attachmentId) return null;
    const loader = this.loaderFactory.create('attachmentById', async (ids: string[]) => {
      const rows = await this.prisma.attachment.findMany({ where: { id: { in: ids } } });
      const map = new Map(rows.map(r => [r.id, r]));
      return ids.map(id => map.get(id) ?? null);
    });
    return loader.load(parent.attachmentId).then((a:any)=>a?.url ?? null);
  } });
  if (!att?.key) return null;
  const d = await (this as any).storage.createDownloadUrl(att.key);
  return d.downloadUrl;
}

@ResolveField('attachmentType', () => String, { nullable: true })
async attachmentType(parent: any) {
    if (!parent?.attachmentId) return null;
    const loader = this.loaderFactory.get('attachmentById');
    return loader.load(parent.attachmentId).then((a:any)=>a?.mimeType ?? null);
  } });
  return att?.contentType || null;
}
