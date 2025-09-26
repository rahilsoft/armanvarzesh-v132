import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { NotificationsService, Notification } from './notifications.service';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

/**
 * Resolver for notification queries, mutations and subscriptions.
 */
@Resolver()
export class NotificationsResolver {
  constructor(private readonly notifService: NotificationsService) {}

  @Query(() => [NotificationType])
  notifications(@Args('userId', { type: () => Int }) userId: number) {
    return this.notifService.getNotifications(userId);
  }

  @Mutation(() => NotificationType)
  async createNotification(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('message') message: string,
    @Args('priority', { defaultValue: 'normal' }) priority: string,
  ) {
    const notif = this.notifService.createNotification(userId, message, priority);
    await pubSub.publish('notificationSent', { notificationSent: notif });
    return notif;
  }

  @Mutation(() => NotificationType, { nullable: true })
  markNotificationAsRead(@Args('id', { type: () => Int }) id: number) {
    return this.notifService.markAsRead(id);
  }

  @Subscription(() => NotificationType, {
    filter: (payload, variables) => {
      return payload.notificationSent.userId === variables.userId;
    },
  })
  notificationSent(@Args('userId', { type: () => Int }) userId: number) {
    return pubSub.asyncIterator('notificationSent');
  }
}

// GraphQL object type for notifications
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('Notification')
export class NotificationType implements Notification {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  message: string;

  @Field()
  priority: string;

  @Field()
  read: boolean;

  @Field()
  createdAt: Date;
}