
import { PrismaClient } from '@prisma/client';

export interface PushPayload { title:string; body:string; data?: Record<string, any>; }

export class PushProvider {
  prisma = new PrismaClient();
  async sendToUser(userId: string, payload: PushPayload){
    const tokens = await this.prisma.deviceToken.findMany({ where:{ userId, enabled: true } });
    // Placeholder: در اینجا به FCM/OneSignal/APNs متصل شوید
    const delivered = tokens.length;
    for (const t of tokens){
      await this.prisma.deviceToken.update({ where:{ id: t.id }, data:{ lastNotifiedAt: new Date() } });
    }
    return { delivered, tokens: tokens.map(t=> t.token) };
  }
}
