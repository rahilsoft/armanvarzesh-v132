import { Injectable, Logger } from '@nestjs/common';
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  async send(userId: string, message: string, channels: Array<'push'|'sms'|'email'> = ['push']) {
    for (const ch of channels) {
      this.logger.log(`Notify(${ch}) to ${userId}: ${message}`);
    }
    // Baseline: plug providers here + retry/backoff
    return true;
  }
}
