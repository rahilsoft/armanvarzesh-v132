import { Injectable } from '@nestjs/common';
import { PrismaClient, NotificationStatus, NotificationType } from '@prisma/client';
import nodemailer from 'nodemailer';
import Twilio from 'twilio';
import * as admin from 'firebase-admin';
import amqp from 'amqplib';

@Injectable()
export class NotificationsService {
  private prisma = new PrismaClient();
  private amqpConn: amqp.Connection | null = null;

  constructor() {
    // Init Firebase admin if key present
    if (process.env.FCM_SERVER_KEY && !admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault()
        });
      } catch {}
    }
    // Init AMQP connection async (fire & forget)
    this.initAmqp().catch(err => console.error('[AMQP] init error', err));
  }

  private async initAmqp() {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
      this.amqpConn = await amqp.connect(url);
      const ch = await this.amqpConn.createChannel();
      await ch.assertQueue('notifications.email', { durable: true });
      await ch.assertQueue('notifications.sms', { durable: true });
      await ch.assertQueue('notifications.push', { durable: true });

      // Consumers with retry DLQ pattern (basic)
      await ch.consume('notifications.email', async (msg) => {
        if (!msg) return;
        const n = JSON.parse(msg.content.toString());
        try { await this.sendEmail(n); ch.ack(msg); }
        catch (e:any) { await this.failOrRetry(ch, 'notifications.email', msg, e); }
      });
      await ch.consume('notifications.sms', async (msg) => {
        if (!msg) return;
        const n = JSON.parse(msg.content.toString());
        try { await this.sendSms(n); ch.ack(msg); }
        catch (e:any) { await this.failOrRetry(ch, 'notifications.sms', msg, e); }
      });
      await ch.consume('notifications.push', async (msg) => {
        if (!msg) return;
        const n = JSON.parse(msg.content.toString());
        try { await this.sendPush(n); ch.ack(msg); }
        catch (e:any) { await this.failOrRetry(ch, 'notifications.push', msg, e); }
      });
    } catch (e) {
      console.error('[AMQP] connection failed; will fallback to direct send', e);
      this.amqpConn = null;
    }
  }

  private async failOrRetry(ch: amqp.Channel, queue: string, msg: amqp.ConsumeMessage, e: any) {
    const headers = (msg.properties.headers || {}) as any;
    const retries = (headers['x-retries'] as number) || 0;
    if (retries >= 3) {
      try { ch.ack(msg); } catch {}
      return;
    }
    ch.nack(msg, false, false);
    ch.sendToQueue(queue, msg.content, {
      headers: { 'x-retries': retries + 1 },
      expiration: String(1000 * Math.pow(2, retries)) // backoff
    });
  }

  // API methods
  async queueEmail(to: string, subject: string, body: string) {
    const rec = await this.prisma.notification.create({ data: { type: NotificationType.EMAIL, to, subject, body } });
    if (this.amqpConn) {
      const ch = await this.amqpConn.createChannel();
      await ch.sendToQueue('notifications.email', Buffer.from(JSON.stringify({ id: rec.id, to, subject, body })), { persistent: true });
    } else {
      await this.sendEmail({ id: rec.id, to, subject, body });
    }
    return rec;
  }

  async queueSms(to: string, body: string) {
    const rec = await this.prisma.notification.create({ data: { type: NotificationType.SMS, to, body } });
    if (this.amqpConn) {
      const ch = await this.amqpConn.createChannel();
      await ch.sendToQueue('notifications.sms', Buffer.from(JSON.stringify({ id: rec.id, to, body })), { persistent: true });
    } else {
      await this.sendSms({ id: rec.id, to, body });
    }
    return rec;
  }

  async queuePush(to: string, body: string) {
    const rec = await this.prisma.notification.create({ data: { type: NotificationType.PUSH, to, body } });
    if (this.amqpConn) {
      const ch = await this.amqpConn.createChannel();
      await ch.sendToQueue('notifications.push', Buffer.from(JSON.stringify({ id: rec.id, to, body })), { persistent: true });
    } else {
      await this.sendPush({ id: rec.id, to, body });
    }
    return rec;
  }

  async findById(id: string) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  // Actual senders
  private async sendEmail(n: any) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp',
      port: Number(process.env.MAIL_PORT || 1025),
      auth: process.env.MAIL_USER ? { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS } : undefined
    });
    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'no-reply@armanfit.local',
      to: n.to,
      subject: n.subject || 'Notification',
      text: n.body
    });
    await this.prisma.notification.update({ where: { id: n.id }, data: { status: NotificationStatus.SENT, sentAt: new Date() } });
  }

  private async sendSms(n: any) {
    const sid = process.env.TWILIO_SID;
    const token = process.env.TWILIO_TOKEN;
    const from = process.env.TWILIO_FROM;
    if (!sid || !token || !from) throw new Error('Twilio not configured');
    const client = Twilio(sid, token);
    await client.messages.create({ body: n.body, to: n.to, from });
    await this.prisma.notification.update({ where: { id: n.id }, data: { status: NotificationStatus.SENT, sentAt: new Date() } });
  }

  private async sendPush(n: any) {
    if (!admin.apps.length) throw new Error('FCM not configured');
    await admin.messaging().send({ token: n.to, notification: { title: 'ArmanFit', body: n.body } });
    await this.prisma.notification.update({ where: { id: n.id }, data: { status: NotificationStatus.SENT, sentAt: new Date() } });
  }
}