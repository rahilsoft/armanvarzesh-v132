import { Injectable } from '@nestjs/common';

/**
 * SMTP email. nodemailer is not a dependency of app/backend yet, so this
 * fails explicitly (never counted as sent). Add `nodemailer` and implement
 * with SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.
 */
@Injectable()
export class EmailProvider {
  async send(_to: string, _subject: string, _body: string): Promise<void> {
    throw new Error('Email is not configured: nodemailer dependency missing');
  }
}
