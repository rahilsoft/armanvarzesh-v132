import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

function uid(): string { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8); return v.toString(16);
});}

const ALLOWED_MIME = new Set(['image/png','image/jpeg','image/webp','audio/mpeg','audio/ogg','application/pdf']);
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

@Injectable()
export class ChatService {
  prisma = new PrismaClient();

  async ensureThread(userId: string, coachId: string){
    let t = await this.prisma.thread.findFirst({ where: { userId, coachId } });
    if (!t){
      t = await this.prisma.thread.create({ data: { id: uid(), userId, coachId } });
      await this.prisma.participant.create({ data: { id: uid(), threadId: t.id, userId, role: 'user' } });
      await this.prisma.participant.create({ data: { id: uid(), threadId: t.id, userId: coachId, role: 'coach' } });
    }
    return t;
  }

  async history(threadId: string, limit=50, cursor?: string){
    const where:any = { threadId };
    const orderBy:any = { createdAt: 'desc' };
    const take = limit;
    const cursorObj = cursor ? { id: cursor } : undefined;
    const rows = await this.prisma.message.findMany({ where, orderBy, take, cursor: cursorObj, include: { attachments: true } });
    return { items: rows.reverse(), nextCursor: rows.length? rows[0].id : null };
  }

  async newMessage(threadId: string, authorId: string, role: 'user'|'coach', body: string|undefined, clientMsgId: string, attachmentIds: string[]){
    if (!clientMsgId) throw new BadRequestException('CLIENT_MSG_ID_REQUIRED');
    // idempotency by clientMsgId
    const exists = await this.prisma.message.findUnique({ where: { clientMsgId } });
    if (exists) return exists;
    const msg = await this.prisma.message.create({ data: { id: uid(), threadId, authorId, authorRole: role, body: body||null, clientMsgId } });
    if (attachmentIds?.length){
      await this.prisma.attachment.updateMany({ where: { id: { in: attachmentIds } }, data: { messageId: msg.id } });
    }
    return msg;
  }

  async markRead(messageId: string, userId: string){
    try {
      await this.prisma.readReceipt.create({ data: { id: uid(), messageId, userId } });
    } catch {}
    return { ok: true };
  }

  // Pre-signed upload (fake local implementation): validate and return URL key
  async presignUpload(kind: string, sizeBytes: number, mime: string){
    if (!ALLOWED_MIME.has(mime)) throw new BadRequestException('MIME_NOT_ALLOWED');
    if (sizeBytes > MAX_SIZE) throw new BadRequestException('FILE_TOO_LARGE');
    const id = uid();
    const uploadKey = `chat/${id}`;
    // Create pending attachment
    await this.prisma.attachment.create({ data: { id, messageId: null as any, kind, url: '', uploadKey, status: 'pending', sizeBytes, mime } as any });
    const url = `https://upload.example/${uploadKey}`; // client should PUT file here in real impl
    const fields = { 'x-amz-meta-scan': 'required' };
    return { attachmentId: id, upload: { url, method: 'PUT', fields }, maxSize: MAX_SIZE };
  }

  // Virus scan webhook
  async onScanResult(attachmentId: string, safe: boolean){
    const a = await this.prisma.attachment.findUnique({ where: { id: attachmentId } });
    if (!a) throw new BadRequestException('ATTACHMENT_NOT_FOUND');
    const status = safe ? 'safe' : 'quarantined';
    const url = safe ? `https://cdn.example/${a.uploadKey}` : '';
    await this.prisma.attachment.update({ where: { id: attachmentId }, data: { status, url } });
    return { ok: true };
  }
}
