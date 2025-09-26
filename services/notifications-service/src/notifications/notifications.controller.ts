import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('email')
  sendEmail(@Body() dto: {to: string; subject: string; html: string}) {
    return this.svc.sendEmail(dto);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post('sms')
  sendSms(@Body() dto: {to: string; body: string}) {
    return this.svc.sendSms(dto);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post('push')
  sendPush(@Body() dto: {token: string; title: string; body: string; data?: any}) {
    return this.svc.sendPush(dto);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }
}