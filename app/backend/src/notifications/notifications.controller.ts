import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import type { DeviceToken, UserPreference } from '@contracts/notifications';

@Controller('notifications/v1')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Post('tokens')
  async registerToken(@Body() token: DeviceToken) {
    await this.svc.registerToken(token);
    return { status: 'ok' };
  }

  @Post('send')
  async send(@Body() body: { userId: string; channel: 'push'|'web'|'email'; title: string; body: string; data?: Record<string,string> }) {
    return this.svc.send(body as any);
  }

  @Get('users/:userId/preferences')
  async getPref(@Param('userId') userId: string): Promise<UserPreference> {
    return this.svc.getPreferences(userId);
  }

  @Put('users/:userId/preferences')
  async setPref(@Param('userId') userId: string, @Body() pref: UserPreference) {
    await this.svc.setPreferences(userId, pref);
    return { status: 'ok' };
  }
}
