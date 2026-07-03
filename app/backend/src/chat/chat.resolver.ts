import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, Subscription, ResolveField, Parent } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';
import { SendMessageInput, SendAttachmentInput } from './dto/message.input';
import { PUB_SUB } from './pubsub.provider';

/**
 * GraphQL resolver exposing chat operations. Supports sending messages,
 * retrieving conversations and inboxes for users, real-time subscriptions
 * and resolving signed URLs for media attachments.
 */
@Resolver(() => Message)
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly storage: StorageService,
  ) {}

  /**
   * Send a new message from one user to another. Returns the persisted
   * message entity.
   */
  @Mutation(() => Message)
  async sendMessage(@Args('input') input: SendMessageInput) {
    return this.chatService.sendMessage(input.senderId, input.receiverId, input.content);
  }

  /**
   * Send a message carrying a media attachment and publish it to subscribers.
   */
  @Mutation(() => Message)
  async sendAttachment(@Args('input') input: SendAttachmentInput) {
    const msg = await this.chatService.sendAttachmentMessage(
      input.senderId,
      input.receiverId,
      input.key,
      input.contentType,
    );
    try {
      await this.pubSub.publish('messageReceived', { messageReceived: msg });
    } catch {}
    return msg;
  }

  /**
   * Retrieve the full conversation between two users ordered by timestamp.
   */
  @Query(() => [Message])
  async conversation(
    @Args('userId1', { type: () => Int }) userId1: number,
    @Args('userId2', { type: () => Int }) userId2: number,
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

  @Subscription(() => Message, {
    filter: (payload, vars) =>
      payload.messageReceived.receiverId === vars.userId ||
      payload.messageReceived.senderId === vars.userId,
  })
  messageReceived(@Args('userId', { type: () => Int }) _userId: number) {
    return this.pubSub.asyncIterator('messageReceived');
  }

  @ResolveField('attachmentUrl', () => String, { nullable: true })
  async attachmentUrl(@Parent() parent: any) {
    if (!parent?.attachmentId) return null;
    const att = await (this.prisma as any).attachment.findUnique({ where: { id: parent.attachmentId } });
    if (!att?.key) return null;
    const d = await this.storage.createDownloadUrl(att.key);
    return d.downloadUrl;
  }

  @ResolveField('attachmentType', () => String, { nullable: true })
  async attachmentType(@Parent() parent: any) {
    if (!parent?.attachmentId) return null;
    const att = await (this.prisma as any).attachment.findUnique({ where: { id: parent.attachmentId } });
    return att?.contentType ?? null;
  }
}
