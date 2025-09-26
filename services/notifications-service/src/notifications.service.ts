import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import hbs from 'handlebars';

function uid(): string { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8); return v.toString(16);
});}

function buildICS(event:{ uid:string, title:string, startUTC:string, endUTC:string, location?:string, description?:string }){
  const lines = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ArmanVarzesh//v96//EN','BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${event.startUTC.replace(/[-:]/g,'').replace('.000','').replace('Z','Z')}`,
    `DTSTART:${event.startUTC.replace(/[-:]/g,'').replace('.000','').replace('Z','Z')}`,
    `DTEND:${event.endUTC.replace(/[-:]/g,'').replace('.000','').replace('Z','Z')}`,
    `SUMMARY:${event.title}`,
    event.location?`LOCATION:${event.location}`:'',
    event.description?`DESCRIPTION:${event.description}`:'',
    'END:VEVENT','END:VCALENDAR'
  ].filter(Boolean);
  return lines.join('\r\n');
}

@Injectable()
export class NotificationsService {
  prisma = new PrismaClient();
  QUIET_START = Number(process.env.QUIET_START_HOUR||22);
  QUIET_END   = Number(process.env.QUIET_END_HOUR||7);
  MAX_ATTEMPTS = 5;

  private resolveLocale(lang?: string){
    const supported = ['fa','en'];
    if (!lang) return 'fa';
    return supported.includes(lang) ? lang : 'fa';
  }

  private loadTemplate(key: string, locale: string){
    const fs = require('fs');
    const paths = [
      `${__dirname}/../templates/${locale}/${key}.mjml`,
      `${__dirname}/../templates/fa/${key}.mjml`
    ];
    for (const p of paths){
      if (fs.existsSync(p)) return fs.readFileSync(p,'utf8');
    }
    throw new BadRequestException('TEMPLATE_NOT_FOUND');
  }

  async schedule(userId: string, templateKey: string, data: any, sendAtIso: string, channels: string[], locale?: string, tz?: string){
    if (!userId || !templateKey || !sendAtIso || !channels?.length) throw new BadRequestException('MISSING_FIELDS');
    const lang = this.resolveLocale(locale);
    const tzStr = tz || 'Europe/Amsterdam';
    const sendAt = new Date(sendAtIso);
    // quiet hours: if sendAt in [quiet_start, quiet_end), push to quiet_end of that day
    const local = new Date(sendAt.toLocaleString('en-US', { timeZone: tzStr }));
    const hour = local.getHours();
    if ((this.QUIET_START <= this.QUIET_END && hour >= this.QUIET_START && hour < this.QUIET_END) ||
        (this.QUIET_START > this.QUIET_END && (hour >= this.QUIET_START || hour < this.QUIET_END))){
      local.setHours(this.QUIET_END, 0, 0, 0);
    }
    const adjustedSendAt = new Date(local.toLocaleString('en-US', { timeZone: 'UTC' }));
    // ICS optional
    let ics: string|undefined;
    if (data?.ics){
      ics = buildICS({ uid: uid(), title: data.ics.title||'Event', startUTC: data.ics.startUTC, endUTC: data.ics.endUTC, location: data.ics.location, description: data.ics.description });
    }
    const n = await this.prisma.notification.create({ data: { id: uid(), userId, templateKey, data, channels, locale: lang, tz: tzStr, sendAt: adjustedSendAt, ics } });
    return { id: n.id, sendAt: n.sendAt.toISOString(), quietAdjusted: adjustedSendAt.getTime() !== sendAt.getTime() };
  }

  private compile(key: string, locale: string, data: any){
    const tpl = this.loadTemplate(key, locale);
    const template = hbs.compile(tpl);
    const html = template(data||{});
    return { subject: (data?.subject || key.replace('.',' ').toUpperCase()), html };
  }

  private backoff(attempts: number){ return Math.min(60_000 * Math.pow(2, attempts), 60*60*1000); } // cap 1h

  async processDue(){
    const now = new Date();
    const due = await this.prisma.notification.findMany({ where: { sendAt: { lte: now }, status: { in: ['scheduled','retrying'] } }, take: 25 });
    for (const n of due){
      try {
        await this.prisma.notification.update({ where: { id: n.id }, data: { status: 'sending', attempts: { increment: 1 } } });
        const rendered = this.compile(n.templateKey, n.locale, n.data);
        const outPayload = { to: n.userId, subject: rendered.subject, html: rendered.html, ics: n.ics||null };
        // simulate per-channel dispatch by writing to Outbox
        for (const ch of n.channels){
          await this.prisma.outbox.create({ data: { id: uid(), notifId: n.id, channel: ch, payload: outPayload as any } });
        }
        await this.prisma.notification.update({ where: { id: n.id }, data: { status: 'sent', lastError: null } });
      } catch(e:any){
        const attempts = n.attempts + 1;
        const nextSend = new Date(Date.now() + this.backoff(attempts));
        const message = String(e?.message || e);
        await this.prisma.notification.update({ where: { id: n.id }, data: { status: attempts>=this.MAX_ATTEMPTS ? 'failed' : 'retrying', lastError: message, attempts, sendAt: nextSend } });
      }
    }
    return { processed: due.length };
  }

  // preview render (no schedule)
  preview(templateKey: string, data: any, locale?: string){
    const lang = this.resolveLocale(locale);
    const out = this.compile(templateKey, lang, data);
    return out;
  }

  listOutbox(limit=50){
    return this.prisma.outbox.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
  }
}
