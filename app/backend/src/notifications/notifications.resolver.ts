import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { NotificationInput } from './dto/notification.input';
import { PUB_SUB } from './notifications.module';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Notification])
  async notifications(@Args('userId', { type: () => Int }) userId: number) {
    return this.notificationsService.findAllByUser(userId);
  }

  @Mutation(() => Notification)
  async createNotification(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('input') input: NotificationInput,
  ) {
    return this.notificationsService.create(userId, input.text, input.isCritical);
  }

  @Mutation(() => Boolean)
  async markNotificationAsRead(@Args('id', { type: () => Int }) id: number) {
    return this.notificationsService.markAsRead(id);
  }

  @Mutation(() => Notification)
  async markNotificationRead(@Args('id', { type: () => Int }) id: number) {
    return this.notificationsService.markRead(id);
  }

  @Mutation(() => Boolean)
  async markAllNotificationsRead(@Args('userId', { type: () => Int }) userId: number) {
    return this.notificationsService.markAllRead(userId);
  }

  /**
   * Delete a notification by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deleteNotification(@Args('id', { type: () => Int }) id: number) {
    return this.notificationsService.delete(id);
  }

  @Subscription(() => Notification, {
    filter: (payload, variables) => payload.notificationReceived.userId === variables.userId,
  })
  notificationReceived(@Args('userId', { type: () => Int }) _userId: number) {
    return this.pubSub.asyncIterator('notificationReceived');
  }
}
