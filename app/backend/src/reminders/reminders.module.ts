import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { PrismaService } from '../database/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [RemindersService, PrismaService],
  exports: [RemindersService]
})
export class RemindersModule {}
