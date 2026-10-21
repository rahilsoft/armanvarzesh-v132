import { Injectable } from '@nestjs/common';

/**
 * Browser Web Push (VAPID) is not configured in this build. Fails explicitly
 * so a notification is never recorded as delivered without being sent.
 */
@Injectable()
export class WebPushProvider {
  async send(_payload: unknown, _token: string): Promise<void> {
    throw new Error('Web push is not configured: VAPID provider not implemented');
  }
}
