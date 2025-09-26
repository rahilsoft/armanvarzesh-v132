import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservationService } from '../reservations/reservation.service';
import { ReminderService } from '../notification/reminder.service';
import { subMinutes, isWithinInterval } from 'date-fns';

@Injectable()
export class SessionReminderJob {
  private readonly logger = new Logger(SessionReminderJob.name);

  constructor(
    private readonly reservationService: ReservationService,
    private readonly reminderService: ReminderService
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    const now = new Date();
    const rangeStart = subMinutes(now, 5);
    const rangeEnd = new Date(now.getTime() + 30 * 60 * 1000);

    const upcoming = await this.reservationService.findUpcomingSessions(rangeStart, rangeEnd);
    for (const session of upcoming) {
      try {
        await this.reminderService.sendSessionReminder(session);
        this.logger.log(`Reminder sent to user ${session.userId}`);
      } catch (err) {
        this.logger.error(`Failed for session ${session.id}`, err);
      }
    }
  }
}
