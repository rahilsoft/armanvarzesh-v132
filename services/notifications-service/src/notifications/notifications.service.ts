import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import fetch from 'node-fetch';

@Injectable()
export class NotificationsService {
  private prisma = new PrismaClient();

  async sendEmail(dto: {to: string; subject: string; html: string}) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp',
      port: Number(process.env.MAIL_PORT || 1025),
      secure: false,
      auth: (process.env.MAIL_USER && process.env.MAIL_PASS) ? { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS } : undefined,
    });
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || 'noreply@armanfit.local',
      to: dto.to,
      subject: dto.subject,
      html: dto.html,
    });
    const rec = await this.prisma.notification.create({ data: { type: 'email', target: dto.to, status: 'sent', provider: 'smtp', providerId: info.messageId }});
    return { id: rec.id };
  }

  async sendSms(dto: {to: string; body: string}) {
    const sid = process.env.TWILIO_SID;
    const token = process.env.TWILIO_TOKEN;
    const from = process.env.TWILIO_FROM;
    if (!sid || !token || !from) throw new Error('Twilio env missing');
    const client = twilio(sid, token);
    const msg = await client.messages.create({ from, to: dto.to, body: dto.body });
    const rec = await this.prisma.notification.create({ data: { type: 'sms', target: dto.to, status: 'sent', provider: 'twilio', providerId: msg.sid }});
    return { id: rec.id };
  }

  async sendPush(dto: {token: string; title: string; body: string; data?: any}) {
    const serverKey = process.env.FCM_SERVER_KEY;
    if (!serverKey) throw new Error('FCM_SERVER_KEY missing');
    const resp = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: { 'Authorization': `key=${serverKey}`, 'Content-Type':'application/json' },
      body: JSON.stringify({ to: dto.token, notification: { title: dto.title, body: dto.body }, data: dto.data || {} })
    });
    const j = await resp.json();
    const rec = await this.prisma.notification.create({ data: { type: 'push', target: dto.token, status: 'sent', provider: 'fcm', providerId: j?.message_id || '' }});
    return { id: rec.id, result: j };
  }

  async get(id: string) {
    return this.prisma.notification.findUnique({ where: { id }});
  }
}