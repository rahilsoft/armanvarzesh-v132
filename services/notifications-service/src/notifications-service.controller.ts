import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications-service.service';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class Notifications_serviceController {
  constructor(private readonly svc: NotificationsService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('email')
  queueEmail(@Body() dto: any) {
    return this.svc.queueEmail(dto.to, dto.subject, dto.body);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post('sms')
  queueSms(@Body() dto: any) {
    return this.svc.queueSms(dto.to, dto.body);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post('push')
  queuePush(@Body() dto: any) {
    return this.svc.queuePush(dto.to, dto.body);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findById(id);
  }
}