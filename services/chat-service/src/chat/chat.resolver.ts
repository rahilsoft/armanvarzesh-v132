import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { ChatService, ChatMessage } from './chat.service';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

/**
 * GraphQL resolver exposing chat operations. Includes a subscription
 * for real-time message delivery. For demonstration purposes the
 * subscription filters by receiverId when provided.
 */
@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query(() => [ChatMessageType])
  messages(@Args('userId', { type: () => Int }) userId: number) {
    return this.chatService.getMessagesForUser(userId);
  }

  @Mutation(() => ChatMessageType)
  async sendMessage(
    @Args('senderId', { type: () => Int }) senderId: number,
    @Args('receiverId', { type: () => Int }) receiverId: number,
    @Args('content') content: string,
    @Args('mediaUrl', { nullable: true }) mediaUrl?: string,
    @Args('mediaType', { nullable: true }) mediaType?: string,
  ) {
    const message = this.chatService.sendMessage(senderId, receiverId, content, mediaUrl, mediaType);
    // Publish the message to subscribers
    await pubSub.publish('messageSent', { messageSent: message });
    return message;
  }

  @Mutation(() => ChatMessageType, { nullable: true })
  markMessageAsRead(@Args('id', { type: () => Int }) id: number) {
    return this.chatService.markAsRead(id);
  }

  @Subscription(() => ChatMessageType, {
    filter: (payload, variables) => {
      // If receiverId is provided as a variable, only send messages to that receiver
      if (variables.receiverId) {
        return payload.messageSent.receiverId === variables.receiverId;
      }
      return true;
    },
  })
  messageSent(@Args('receiverId', { type: () => Int, nullable: true }) receiverId?: number) {
    return pubSub.asyncIterator('messageSent');
  }
}

// GraphQL object type for chat messages
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('ChatMessage')
export class ChatMessageType implements ChatMessage {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  senderId: number;

  @Field(() => Int)
  receiverId: number;

  @Field()
  content: string;

  @Field({ nullable: true })
  mediaUrl?: string;

  @Field({ nullable: true })
  mediaType?: string;

  @Field()
  isRead: boolean;

  @Field()
  createdAt: Date;
}