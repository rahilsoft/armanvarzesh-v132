import { withRetry } from '../retry.util';

import { Controller, Get, Param } from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { Notification } from '../entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get(':userId')
  async findAll(@Param('userId') userId: number): Promise<Notification[]> {
    return this.notificationsService.findAllByUser(Number(userId));
  }
}