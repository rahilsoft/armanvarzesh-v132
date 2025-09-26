import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';
import { Reservation } from '../reservations/reservation.entity';
import { format } from 'date-fns';

@Injectable()
export class ReminderService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {}

  async sendSessionReminder(reservation: Reservation): Promise<void> {
    const user = await this.userService.findById(reservation.userId);
    if (!user || !user.deviceToken) return;

    const formatted = format(new Date(reservation.startTime), 'HH:mm dd/MM/yyyy');
    await this.notificationService.sendPushNotification({
      to: user.deviceToken,
      title: 'یادآوری جلسه تمرین',
      body: `جلسه تمرین شما ساعت ${formatted} برگزار می‌شود.`,
      data: {
        reservationId: reservation.id,
        type: 'SESSION_REMINDER'
      }
    });
  }
}
