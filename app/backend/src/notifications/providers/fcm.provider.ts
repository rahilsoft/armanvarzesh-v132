import { Injectable } from '@nestjs/common';
const DRY_RUN = process.env.NOTIFICATIONS_DRY_RUN === 'true';
@Injectable()
export class FcmProvider {
  constructor() {}
  async send(payload: any, token: string): Promise<void> {
    if (DRY_RUN) return;
    // TODO: integrate real provider SDK here using secrets from Secret Manager
    // token identifies the destination (device/web subscription/email)
    void payload; void token;
  }
}
