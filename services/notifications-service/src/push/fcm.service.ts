import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

/**
 * FCM Push Notification Service
 */
@Injectable()
export class FCMService {
  private app: admin.app.App;

  constructor() {
    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FCM_PROJECT_ID,
        clientEmail: process.env.FCM_CLIENT_EMAIL,
        privateKey: process.env.FCM_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  async sendToDevice(token: string, notification: { title: string; body: string }, data?: Record<string, string>) {
    return this.app.messaging().send({
      token,
      notification,
      data,
      android: { priority: 'high' },
      apns: { payload: { aps: { sound: 'default' } } },
    });
  }

  async sendToTopic(topic: string, notification: { title: string; body: string }) {
    return this.app.messaging().send({ topic, notification });
  }
}
